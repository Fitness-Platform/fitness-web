import { ApiError } from "../../../services/apiClient";

export const structureLabel =
  "block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground";
export const structureInput =
  "mt-2 min-h-12 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary-dark disabled:opacity-50";
export const adminManageInteraction =
  "transition-colors hover:bg-primary-dark hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark";
export const structureButton =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark disabled:cursor-not-allowed disabled:opacity-50 " + adminManageInteraction;
export const structurePrimary =
  "min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50";
export const structureDanger =
  "min-h-11 bg-red-700 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50";
export const structureCancel =
  "admin-secondary-action min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] disabled:opacity-50";

export function structureError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 409 && /already in use/i.test(error.message)) {
      return "This item cannot be removed because it is already in use.";
    }
    if (
      !/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(
        error.message,
      )
    )
      return error.message;
  }
  return "Unable to save this change. Refresh and try again.";
}
