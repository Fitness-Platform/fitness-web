import { ApiError } from "../../../services/apiClient";

export const structureLabel =
  "block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground";
export const structureInput =
  "mt-2 min-h-12 w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary-dark disabled:opacity-50";
export const structureButton =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50";
export const structurePrimary =
  "min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50";
export const structureDanger =
  "min-h-11 bg-red-700 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50";
export const structureCancel =
  "min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] disabled:opacity-50";

export function structureError(error: unknown) {
  return error instanceof ApiError
    ? error.message
    : "Unable to save this change. Please try again.";
}
