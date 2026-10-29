import type { MediaPurpose, UploadedMedia } from "../types/adminMedia.ts";

export const mediaRules = {
  EXERCISE_VIDEO: {
    types: ["video/mp4", "video/webm"],
    extensions: ["mp4", "webm"],
    accept: ".mp4,.webm,video/mp4,video/webm",
    max: 104857600,
    label: "MP4 or WebM · Maximum 100 MB",
  },
  PROGRAM_RESOURCE: {
    types: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
    extensions: ["pdf", "jpg", "jpeg", "png", "webp"],
    accept:
      ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp",
    max: 20971520,
    label: "PDF, JPEG, PNG or WebP · Maximum 20 MB",
  },
} as const;

export function validateMediaFile(
  file: Pick<File, "name" | "type" | "size">,
  purpose: MediaPurpose,
): string | null {
  const rule = mediaRules[purpose];
  const extension = file.name.split(".").at(-1)?.toLowerCase() ?? "";
  if (
    !(rule.types as readonly string[]).includes(file.type) ||
    !(rule.extensions as readonly string[]).includes(extension)
  )
    return purpose === "EXERCISE_VIDEO"
      ? "Choose an MP4 or WebM video."
      : "Choose a PDF, JPEG, PNG or WebP file.";
  if (
    !file.name.trim() ||
    file.name.length > 255 ||
    Array.from(file.name).some(
      (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
    )
  )
    return "Use a filename of 255 characters or fewer without control characters.";
  if (!Number.isSafeInteger(file.size) || file.size <= 0)
    return "Choose a file that is not empty.";
  if (file.size > rule.max)
    return purpose === "EXERCISE_VIDEO"
      ? "Video must be 100 MB or smaller."
      : "Resource must be 20 MB or smaller.";
  return null;
}

export function formatMediaSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function mediaSourceFields(
  source: "upload" | "external",
  url: string,
  media: UploadedMedia | null,
) {
  return source === "external"
    ? { url: url.trim() || null, mediaId: null }
    : { url: null, mediaId: media?.id ?? null };
}

export function adminMediaErrorMessage(error: unknown): string {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? error.status
      : null;
  const payload =
    typeof error === "object" && error !== null && "payload" in error
      ? error.payload
      : null;
  const code =
    typeof payload === "object" && payload !== null && "code" in payload
      ? payload.code
      : null;
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403)
    return "You do not have permission to manage this media. Refresh and sign in as an administrator.";
  if (status === 503)
    return "Media storage is temporarily unavailable. Please try again later.";
  if (code === "EXPIRED")
    return "Upload authorization expired. Retry the upload.";
  if (code === "VERIFICATION_FAILED")
    return "The uploaded file could not be verified. Retry the upload.";
  if (code === "MISSING")
    return "The uploaded file was not found. Retry the upload.";
  if (code === "INVALID_REFERENCE" || code === "NOT_COMPLETED")
    return "This file is no longer available to attach. Choose it again and upload before saving.";
  if (status === 413 || code === "TOO_LARGE")
    return "The file exceeds the allowed size. Choose a smaller file.";
  if (status === 415)
    return "This file type is not supported. Choose one of the listed types.";
  if (status === 400)
    return "Review the file and form information, then try again.";
  return "Unable to save this media. Please check your connection and try again.";
}
