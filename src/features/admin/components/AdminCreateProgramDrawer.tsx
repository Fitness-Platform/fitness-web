import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError } from "../../../services/apiClient";
import { useCreateAdminProgramMutation } from "../hooks/useCreateAdminProgramMutation";

const createProgramSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Program name is required.")
    .max(150, "Program name must be 150 characters or fewer."),

  description: z.string().trim(),
});

type CreateProgramFormData = z.infer<typeof createProgramSchema>;

type AdminCreateProgramDrawerProps = {
  onClose: () => void;
};

function AdminCreateProgramDrawer({ onClose }: AdminCreateProgramDrawerProps) {
  const createProgramMutation = useCreateAdminProgramMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProgramFormData>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !createProgramMutation.isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [createProgramMutation.isPending, onClose]);

  async function handleCreateProgram(data: CreateProgramFormData) {
    try {
      await createProgramMutation.mutateAsync({
        name: data.name.trim(),
        description: data.description.trim() || null,
      });

      reset();
      onClose();
    } catch {
      // Mutation error is displayed in the drawer.
    }
  }

  const errorMessage =
    createProgramMutation.error instanceof ApiError &&
    createProgramMutation.error.status === 400
      ? "Review the program information and try again."
      : "Unable to create the program. Please try again.";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close create program"
        onClick={() => {
          if (!createProgramMutation.isPending) {
            onClose();
          }
        }}
        className="absolute inset-0 h-full w-full bg-foreground/30"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-program-title"
        className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-border bg-background sm:max-w-[480px]"
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-6 sm:px-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
              Program management
            </p>

            <h2
              id="create-program-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
            >
              Create Program
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add a new training program to your catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={createProgramMutation.isPending}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center text-foreground transition hover:text-primary-dark disabled:opacity-50"
          >
            <X className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit(handleCreateProgram)}
          noValidate
        >
          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
            {createProgramMutation.isError && (
              <div
                role="alert"
                className="mb-6 border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="program-name"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Program name *
              </label>

              <input
                id="program-name"
                type="text"
                disabled={createProgramMutation.isPending}
                {...register("name")}
                className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary-dark disabled:opacity-50"
              />

              {errors.name && (
                <p className="mt-2 text-xs text-red-700">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="program-description"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Description
              </label>

              <textarea
                id="program-description"
                rows={7}
                disabled={createProgramMutation.isPending}
                {...register("description")}
                className="mt-2 w-full resize-none border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary-dark disabled:opacity-50"
              />
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark">
                Draft status
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                New programs begin as drafts. You can add pricing and publish
                the program later.
              </p>
            </div>
          </div>

          <div className="flex gap-3 border-t border-border px-6 py-5 sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={createProgramMutation.isPending}
              className="min-h-11 flex-1 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createProgramMutation.isPending}
              className="min-h-11 flex-1 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {createProgramMutation.isPending
                ? "Creating..."
                : "Create Program"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default AdminCreateProgramDrawer;
