import { ApiError } from "../../../services/apiClient";
import type { AdminProgramAccess } from "../types/adminDashboard";

export type AccessStatus = "REVOKED" | "SCHEDULED" | "EXPIRED" | "ACTIVE";
export function accessStatus(
  access: AdminProgramAccess,
  now = Date.now(),
): AccessStatus {
  if (access.revokedAt !== null) return "REVOKED";
  if (Date.parse(access.startsAt) > now) return "SCHEDULED";
  if (access.expiresAt !== null && Date.parse(access.expiresAt) <= now)
    return "EXPIRED";
  return "ACTIVE";
}
export function canRevokeAccess(access: AdminProgramAccess, now = Date.now()) {
  const status = accessStatus(access, now);
  return status === "ACTIVE" || status === "SCHEDULED";
}
export function accessDate(value: string | null) {
  return value === null
    ? "No expiration"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value));
}
export function localDateTime(value = new Date()) {
  return new Date(value.getTime() - value.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}
export function accessError(
  error: unknown,
  fallback = "Unable to save this access change. Please try again.",
) {
  if (error instanceof ApiError) {
    const title =
      typeof error.payload === "object" &&
      error.payload !== null &&
      "title" in error.payload
        ? String(error.payload.title)
        : "";
    if (error.status === 404 && /user not found/i.test(title + error.message))
      return "This client is no longer available. Refresh the client search and choose another client.";
    if (
      error.status === 404 &&
      /program not found/i.test(title + error.message)
    )
      return "This program is no longer available. Refresh the programs and choose another program.";
    if (error.status === 404)
      return "This access is no longer available. Refresh the access list.";
    if (
      error.status === 400 &&
      /period|expiration/i.test(title + error.message)
    )
      return "Expiration must be strictly after the start time.";
    if (error.status === 403)
      return "You do not have permission to manage program access.";
    if (error.status === 401)
      return "Your session has expired. Please sign in again.";
  }
  return fallback;
}
