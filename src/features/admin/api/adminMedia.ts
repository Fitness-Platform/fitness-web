import { apiRequest } from "../../../services/apiClient";
import { getCsrfToken } from "../../auth/api/getCsrfToken";
import type {
  MediaUploadAuthorization,
  MediaUploadRequest,
  UploadedMedia,
} from "../types/adminMedia";

async function mediaPost<T>(
  path: string,
  signal: AbortSignal,
  body?: MediaUploadRequest,
) {
  const csrf = await getCsrfToken();
  signal.throwIfAborted();
  return apiRequest<T>(path, {
    method: "POST",
    signal,
    headers: {
      [csrf.headerName]: csrf.token,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}
export function authorizeAdminMedia(
  request: MediaUploadRequest,
  signal: AbortSignal,
) {
  return mediaPost<MediaUploadAuthorization>(
    "/api/admin/media/uploads",
    signal,
    request,
  );
}
export function completeAdminMedia(id: string, signal: AbortSignal) {
  return mediaPost<UploadedMedia>(
    `/api/admin/media/uploads/${encodeURIComponent(id)}/complete`,
    signal,
  );
}
