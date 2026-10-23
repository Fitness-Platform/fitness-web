import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiError } from "../../../services/apiClient";
import { useDeleteAdminProgramMutation } from "../hooks/useDeleteAdminProgramMutation";
import type { AdminProgram } from "../types/adminDashboard";

type AdminProgramDangerZoneProps = {
  program: AdminProgram;
};

function AdminProgramDangerZone({ program }: AdminProgramDangerZoneProps) {
  const navigate = useNavigate();

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const deleteProgramMutation = useDeleteAdminProgramMutation({
    programId: program.id,
  });

  async function handleDelete() {
    try {
      await deleteProgramMutation.mutateAsync();

      navigate("/admin/programs", {
        replace: true,
      });
    } catch {
      // Error is displayed in the confirmation dialog.
    }
  }

  const errorMessage =
    deleteProgramMutation.error instanceof ApiError &&
    deleteProgramMutation.error.status === 404
      ? "Program not found."
      : "Unable to delete this program. It may already be in use or have related history.";

  return (
    <>
      <section className="border border-red-200 bg-background p-5 sm:p-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-red-700">
          Danger zone
        </p>

        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Delete program
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Permanently remove this program from your catalog. This action
              cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              deleteProgramMutation.reset();
              setIsConfirmationOpen(true);
            }}
            className="min-h-11 shrink-0 border border-red-300 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-red-700 transition hover:bg-red-50"
          >
            Delete Program
          </button>
        </div>
      </section>

      {isConfirmationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() => {
              if (!deleteProgramMutation.isPending) {
                setIsConfirmationOpen(false);
              }
            }}
            className="absolute inset-0 h-full w-full bg-foreground/30"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-program-title"
            className="relative z-10 w-full max-w-md border border-border bg-background p-6 sm:p-8"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-red-700">
              Delete program
            </p>

            <h2
              id="delete-program-title"
              className="mt-3 text-xl font-semibold tracking-tight text-foreground"
            >
              Delete {program.name}?
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This permanently removes the program from your catalog and cannot
              be undone.
            </p>

            {deleteProgramMutation.isError && (
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
                onClick={() => setIsConfirmationOpen(false)}
                disabled={deleteProgramMutation.isPending}
                className="min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteProgramMutation.isPending}
                className="min-h-11 bg-red-700 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteProgramMutation.isPending
                  ? "Deleting..."
                  : "Delete Program"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default AdminProgramDangerZone;
