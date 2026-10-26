import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError } from "../../../services/apiClient";
import { useCreateAdminExerciseMutation } from "../hooks/useCreateAdminExerciseMutation";

const createExerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Exercise name is required.")
    .max(
      150,
      "Exercise name must be 150 characters or fewer.",
    ),

  equipment: z
    .string()
    .trim()
    .max(
      120,
      "Equipment must be 120 characters or fewer.",
    ),

  instructions: z.string().trim(),

  videoUrl: z
    .string()
    .trim()
    .max(
      2048,
      "Video URL must be 2048 characters or fewer.",
    ),
});

type CreateExerciseFormData = z.infer<
  typeof createExerciseSchema
>;

type AdminCreateExerciseDrawerProps = {
  onClose: () => void;
};

function AdminCreateExerciseDrawer({
  onClose,
}: AdminCreateExerciseDrawerProps) {
  const createExerciseMutation =
    useCreateAdminExerciseMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExerciseFormData>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      name: "",
      equipment: "",
      instructions: "",
      videoUrl: "",
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
        !createExerciseMutation.isPending
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
    createExerciseMutation.isPending,
    onClose,
  ]);

  async function handleCreateExercise(
    data: CreateExerciseFormData,
  ) {
    try {
      await createExerciseMutation.mutateAsync({
        name: data.name.trim(),
        equipment:
          data.equipment.trim() || null,
        instructions:
          data.instructions.trim() || null,
        videoUrl:
          data.videoUrl.trim() || null,
      });

      reset();
      onClose();
    } catch {
      // Error is displayed in the drawer.
    }
  }

  const errorMessage =
    createExerciseMutation.error instanceof
      ApiError &&
    createExerciseMutation.error.status === 400
      ? "Review the exercise information and try again."
      : "Unable to create the exercise. Please try again.";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close create exercise"
        onClick={() => {
          if (
            !createExerciseMutation.isPending
          ) {
            onClose();
          }
        }}
        className="absolute inset-0 h-full w-full bg-foreground/30"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-exercise-title"
        className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-border bg-background sm:max-w-[520px]"
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-6 sm:px-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-dark">
              Exercise Library
            </p>

            <h2
              id="create-exercise-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
            >
              Create Exercise
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Add a reusable exercise to your
              training library.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              if (
                !createExerciseMutation.isPending
              ) {
                onClose();
              }
            }}
            className="p-1 text-foreground transition hover:text-primary-dark"
          >
            <X
              className="h-5 w-5"
              strokeWidth={1.5}
            />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(
            handleCreateExercise,
          )}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            <div>
              <label
                htmlFor="exercise-name"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Exercise Name *
              </label>

              <input
                id="exercise-name"
                type="text"
                {...register("name")}
                className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary-dark"
              />

              {errors.name && (
                <p className="mt-2 text-xs text-red-700">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="exercise-equipment"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Equipment
              </label>

              <input
                id="exercise-equipment"
                type="text"
                placeholder="e.g. Dumbbell"
                {...register("equipment")}
                className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary-dark"
              />

              {errors.equipment && (
                <p className="mt-2 text-xs text-red-700">
                  {errors.equipment.message}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label
                htmlFor="exercise-instructions"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Instructions
              </label>

              <textarea
                id="exercise-instructions"
                rows={5}
                {...register("instructions")}
                className="mt-2 w-full resize-none border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:border-primary-dark"
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="exercise-video-url"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
              >
                Video URL
              </label>

              <input
                id="exercise-video-url"
                type="text"
                placeholder="https://..."
                {...register("videoUrl")}
                className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary-dark"
              />

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Add a video URL for exercise
                demonstration.
              </p>

              {errors.videoUrl && (
                <p className="mt-2 text-xs text-red-700">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>

            {createExerciseMutation.isError && (
              <div
                role="alert"
                className="mt-6 border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm leading-6 text-red-700">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={
                createExerciseMutation.isPending
              }
              className="min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createExerciseMutation.isPending
              }
              className="min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createExerciseMutation.isPending
                ? "Creating..."
                : "Create Exercise"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

export default AdminCreateExerciseDrawer;