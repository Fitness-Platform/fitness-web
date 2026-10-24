import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError } from "../../../services/apiClient";
import { useCreateAdminWorkoutMutation } from "../hooks/useCreateAdminWorkoutMutation";

const createWorkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workout name is required.")
    .max(
      150,
      "Workout name must be 150 characters or fewer.",
    ),

  description: z.string().trim(),
});

type CreateWorkoutFormData = z.infer<
  typeof createWorkoutSchema
>;

type AdminCreateWorkoutDrawerProps = {
  onClose: () => void;
};

function AdminCreateWorkoutDrawer({
  onClose,
}: AdminCreateWorkoutDrawerProps) {
  const createWorkoutMutation =
    useCreateAdminWorkoutMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkoutFormData>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !createWorkoutMutation.isPending
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    createWorkoutMutation.isPending,
    onClose,
  ]);

  async function handleCreateWorkout(
    data: CreateWorkoutFormData,
  ) {
    try {
      await createWorkoutMutation.mutateAsync({
        name: data.name.trim(),
        description:
          data.description.trim() || null,
      });

      reset();
      onClose();
    } catch {
      // Mutation error is displayed below.
    }
  }

  const errorMessage =
    createWorkoutMutation.error instanceof
      ApiError &&
    createWorkoutMutation.error.status === 400
      ? "Review the workout information and try again."
      : "Unable to create the workout. Please try again.";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close create workout"
        onClick={() => {
          if (
            !createWorkoutMutation.isPending
          ) {
            onClose();
          }
        }}
        className="absolute inset-0 h-full w-full bg-foreground/30"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-workout-title"
        className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-border bg-background sm:max-w-[480px]"
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-6 sm:px-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
              Workout management
            </p>

            <h2
              id="create-workout-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
            >
              Create Workout
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create a reusable training
              session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              createWorkoutMutation.isPending
            }
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center text-foreground disabled:opacity-50"
          >
            <X
              className="h-5 w-5"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(
            handleCreateWorkout,
          )}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            <div>
              <label
                htmlFor="workout-name"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Workout Name *
              </label>

              <input
                id="workout-name"
                type="text"
                disabled={
                  createWorkoutMutation.isPending
                }
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
                htmlFor="workout-description"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Description
              </label>

              <textarea
                id="workout-description"
                rows={7}
                disabled={
                  createWorkoutMutation.isPending
                }
                {...register("description")}
                className="mt-2 w-full resize-none border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary-dark disabled:opacity-50"
              />
            </div>

            {createWorkoutMutation.isError && (
              <div
                role="alert"
                className="mt-6 border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-700">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 border-t border-border px-6 py-5 sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={
                createWorkoutMutation.isPending
              }
              className="min-h-11 flex-1 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark disabled:opacity-50 sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createWorkoutMutation.isPending
              }
              className="min-h-11 flex-1 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {createWorkoutMutation.isPending
                ? "Creating..."
                : "Create Workout"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default AdminCreateWorkoutDrawer;