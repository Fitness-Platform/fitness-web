import type {
  MediaPurpose,
  MediaUploadAuthorization,
  MediaUploadPhase,
  MediaUploadRequest,
  UploadedMedia,
} from "../types/adminMedia.ts";
import { validateMediaFile } from "./mediaInput.ts";

export class MediaTransferError extends Error {
  constructor(
    message = "Upload failed. Check your connection and retry the upload.",
  ) {
    super(message);
    this.name = "MediaTransferError";
  }
}

// Separate from the cookie/CSRF API client. Never log or persist the signed URL.
export function putPresignedFile(
  authorization: MediaUploadAuthorization,
  file: File,
  signal: AbortSignal,
  onProgress: (percent: number | null) => void,
  createXhr = () => new XMLHttpRequest(),
): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    let url: URL;
    try {
      url = new URL(authorization.uploadUrl);
    } catch {
      reject(new MediaTransferError());
      return;
    }
    if (url.protocol !== "https:" || url.username || url.password) {
      reject(new MediaTransferError());
      return;
    }
    const xhr = createXhr();
    function cleanup() {
      signal.removeEventListener("abort", abort);
    }
    function abort() {
      xhr.abort();
      cleanup();
      reject(new DOMException("Upload cancelled", "AbortError"));
    }
    signal.addEventListener("abort", abort, { once: true });
    xhr.open("PUT", authorization.uploadUrl);
    xhr.withCredentials = false;
    for (const [key, value] of Object.entries(authorization.requiredHeaders))
      xhr.setRequestHeader(key, value);
    xhr.upload.onprogress = (event) =>
      onProgress(
        event.lengthComputable && event.total > 0
          ? Math.min(100, Math.floor((event.loaded / event.total) * 100))
          : null,
      );
    xhr.onload = () => {
      cleanup();
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new MediaTransferError());
    };
    xhr.onerror = () => {
      cleanup();
      reject(new MediaTransferError());
    };
    xhr.ontimeout = () => {
      cleanup();
      reject(new MediaTransferError("Upload timed out. Retry the upload."));
    };
    xhr.onabort = () => {
      cleanup();
      reject(new DOMException("Upload cancelled", "AbortError"));
    };
    xhr.timeout = 15 * 60 * 1000;
    xhr.send(file);
  });
}

export async function uploadMediaFile(
  file: File,
  purpose: MediaPurpose,
  signal: AbortSignal,
  deps: {
    authorize: (
      request: MediaUploadRequest,
      signal: AbortSignal,
    ) => Promise<MediaUploadAuthorization>;
    put: typeof putPresignedFile;
    complete: (id: string, signal: AbortSignal) => Promise<UploadedMedia>;
  },
  onPhase: (phase: MediaUploadPhase) => void,
  onProgress: (percent: number | null) => void,
): Promise<UploadedMedia> {
  const invalid = validateMediaFile(file, purpose);
  if (invalid) throw new MediaTransferError(invalid);
  signal.throwIfAborted();
  onPhase("authorizing");
  const authorization = await deps.authorize(
    {
      purpose,
      originalFilename: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    },
    signal,
  );
  signal.throwIfAborted();
  if (
    !Number.isFinite(Date.parse(authorization.expiresAt)) ||
    Date.now() >= Date.parse(authorization.expiresAt)
  )
    throw new MediaTransferError(
      "Upload authorization expired. Retry the upload.",
    );
  onPhase("uploading");
  await deps.put(authorization, file, signal, onProgress);
  signal.throwIfAborted();
  onPhase("verifying");
  const verified = await deps.complete(authorization.uploadId, signal);
  signal.throwIfAborted();
  if (
    verified.id !== authorization.uploadId ||
    verified.sourceType !== "UPLOADED" ||
    verified.contentType !== file.type ||
    verified.sizeBytes !== file.size
  )
    throw new MediaTransferError(
      "The uploaded file could not be verified. Retry the upload.",
    );
  return verified;
}
