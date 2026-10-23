import { useState } from "react";

import { ApiError } from "../../../services/apiClient";
import { useUpdateAdminProgramStatusMutation } from "../hooks/useUpdateAdminProgramStatusMutation";
import type { AdminProgram } from "../types/adminDashboard";

type AdminProgramStatusCardProps = {
  program: AdminProgram;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function AdminProgramStatusCard({ program }: AdminProgramStatusCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const updateStatusMutation = useUpdateAdminProgramStatusMutation({
    programId: program.id,
  });

  const isPublished = program.status === "PUBLISHED";

  const action = isPublished ? "DRAFT" : "PUBLISH";

  const actionLabel = isPublished ? "Move to Draft" : "Publish Program";

  const confirmationTitle = isPublished
    ? "Move this program back to draft?"
    : `Publish ${program.name}?`;

  const confirmationDescription = isPublished
    ? "This program will no longer be available as a published program until you publish it again."
    : "This program will become published and available according to the platform's existing access and purchase rules.";

  async function handleConfirm() {
    try {
      await updateStatusMutation.mutateAsync(action);

      setIsConfirmOpen(false);
    } catch {
      // Error is displayed inside the confirmation.
    }
  }

  const errorMessage =
    updateStatusMutation.error instanceof ApiError &&
    updateStatusMutation.error.status === 404
      ? "Program not found."
      : "Unable to update the program status. Please try again.";

  return (
    <>
      <section className="border border-border bg-background p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark">
          Status
        </p>

        <div className="mt-4">
          <span
            className={
              isPublished
                ? "inline-block bg-primary/10 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark"
                : "inline-block bg-[#F3EEE1] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#776842]"
            }
          >
            {program.status}
          </span>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Last updated
          </p>

          <p className="mt-1 text-sm text-foreground">
            {formatDate(program.updatedAt)}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Created
          </p>

          <p className="mt-1 text-sm text-foreground">
            {formatDate(program.createdAt)}
          </p>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className={
              isPublished
                ? "min-h-10 w-full border border-primary-dark px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-primary-dark transition hover:bg-primary-dark hover:text-background"
                : "min-h-10 w-full bg-primary-dark px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-background transition hover:opacity-90"
            }
          >
            {actionLabel}
          </button>
        </div>
      </section>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Close confirmation"
            className="absolute inset-0 h-full w-full bg-foreground/30"
            onClick={() => {
              if (!updateStatusMutation.isPending) {
                setIsConfirmOpen(false);
              }
            }}
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="program-status-confirmation-title"
            className="relative z-10 w-full max-w-md border border-border bg-background p-6 sm:p-8"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
              Program status
            </p>

            <h2
              id="program-status-confirmation-title"
              className="mt-3 text-xl font-semibold tracking-tight text-foreground"
            >
              {confirmationTitle}
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {confirmationDescription}
            </p>

            {updateStatusMutation.isError && (
              <div
                role="alert"
                className="mt-5 border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={updateStatusMutation.isPending}
                className="min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={updateStatusMutation.isPending}
                className="min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateStatusMutation.isPending ? "Updating..." : actionLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default AdminProgramStatusCard;
