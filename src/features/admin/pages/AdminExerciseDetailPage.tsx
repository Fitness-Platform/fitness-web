import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { z } from "zod";

import { ApiError } from "../../../services/apiClient";
import { useAdminExerciseQuery } from "../hooks/useAdminExerciseQuery";
import { useUpdateAdminExerciseMutation } from "../hooks/useUpdateAdminExerciseMutation";

import AdminDeleteExerciseDialog from "../components/AdminDeleteExerciseDialog";

const editExerciseSchema = z.object({
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

type EditExerciseFormData = z.infer<
  typeof editExerciseSchema
>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function AdminExerciseDetailPage() {
  const { exerciseId = "" } = useParams();

  const [isEditing, setIsEditing] =
    useState(false);

  const navigate = useNavigate();

  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false);

  const {
    data: exercise,
    isPending,
    isError,
    refetch,
  } = useAdminExerciseQuery(exerciseId);

  const updateExerciseMutation =
    useUpdateAdminExerciseMutation({
      exerciseId,
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditExerciseFormData>({
    resolver: zodResolver(
      editExerciseSchema,
    ),
    defaultValues: {
      name: "",
      equipment: "",
      instructions: "",
      videoUrl: "",
    },
  });

  if (isPending) {
    return (
      <p
        role="status"
        className="text-sm text-muted-foreground"
      >
        Loading exercise...
      </p>
    );
  }

  if (isError || !exercise) {
    return (
      <section className="border border-border p-5">
        <p className="text-sm font-medium text-foreground">
          Unable to load exercise
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Something went wrong while loading
          this exercise.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark"
        >
          Try Again
        </button>
      </section>
    );
  }

  const currentExercise = exercise;

  const hasVideo =
    Boolean(exercise.videoUrl?.trim());

  function handleStartEdit() {
    reset({
      name: currentExercise.name,
      equipment:
        currentExercise.equipment ?? "",
      instructions:
        currentExercise.instructions ?? "",
      videoUrl:
        currentExercise.videoUrl ?? "",
    });

    updateExerciseMutation.reset();
    setIsEditing(true);
  }

  function handleCancelEdit() {
    reset({
      name: currentExercise.name,
      equipment:
        currentExercise.equipment ?? "",
      instructions:
        currentExercise.instructions ?? "",
      videoUrl:
        currentExercise.videoUrl ?? "",
    });

    updateExerciseMutation.reset();
    setIsEditing(false);
  }

  async function handleSaveChanges(
    data: EditExerciseFormData,
  ) {
    try {
      await updateExerciseMutation.mutateAsync({
        request: {
          name: data.name.trim(),
          equipment:
            data.equipment.trim() || null,
          instructions:
            data.instructions.trim() || null,
          videoUrl:
            data.videoUrl.trim() || null,
        },
      });

      setIsEditing(false);
    } catch {
      // Error is displayed below the form.
    }
  }

  const updateErrorMessage =
    updateExerciseMutation.error instanceof
      ApiError &&
      updateExerciseMutation.error.status === 400
      ? "Review the exercise information and try again."
      : "Unable to update the exercise. Please try again.";

  return (
    <div className="space-y-8 lg:space-y-10">
      <header>
        <Link
          to="/admin/exercises"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark"
        >
          <ArrowLeft
            className="h-3.5 w-3.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />

          Exercises
        </Link>

        <h1 className="mt-8 text-[32px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
          {exercise.name}
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {exercise.equipment ||
            "No equipment specified"}
        </p>
      </header>

      <section className="border border-border p-6 lg:p-7">
        {!isEditing ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
                Exercise Details
              </p>

              <button
                type="button"
                onClick={handleStartEdit}
                className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark transition hover:opacity-70"
              >
                Edit
              </button>
            </div>

            <div className="mt-8 space-y-7">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Name
                </p>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {exercise.name}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Equipment
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  {exercise.equipment || "—"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Instructions
                </p>

                <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-muted-foreground">
                  {exercise.instructions ||
                    "No instructions provided."}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Video
                </p>

                {hasVideo ? (
                  <a
                    href={
                      exercise.videoUrl ??
                      undefined
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark"
                  >
                    View Video →
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No video available.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSubmit(
              handleSaveChanges,
            )}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
              Exercise Details
            </p>

            <div className="mt-8 grid gap-6">
              <div>
                <label
                  htmlFor="exercise-name"
                  className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
                >
                  Name *
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

              <div>
                <label
                  htmlFor="exercise-equipment"
                  className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
                >
                  Equipment
                </label>

                <input
                  id="exercise-equipment"
                  type="text"
                  {...register("equipment")}
                  className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary-dark"
                />

                {errors.equipment && (
                  <p className="mt-2 text-xs text-red-700">
                    {
                      errors.equipment
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
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

              <div>
                <label
                  htmlFor="exercise-video-url"
                  className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
                >
                  Video URL
                </label>

                <input
                  id="exercise-video-url"
                  type="text"
                  {...register("videoUrl")}
                  className="mt-2 h-12 w-full border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary-dark"
                />

                {errors.videoUrl && (
                  <p className="mt-2 text-xs text-red-700">
                    {
                      errors.videoUrl
                        .message
                    }
                  </p>
                )}
              </div>

              {updateExerciseMutation.isError && (
                <div
                  role="alert"
                  className="border border-red-200 bg-red-50 px-4 py-3"
                >
                  <p className="text-sm leading-6 text-red-700">
                    {updateErrorMessage}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={
                    updateExerciseMutation.isPending
                  }
                  className="min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    updateExerciseMutation.isPending
                  }
                  className="min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateExerciseMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Created
            </p>

            <p className="mt-2 text-sm text-foreground">
              {formatDate(exercise.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-2 text-sm text-foreground">
              {formatDate(exercise.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      <section className="border border-border px-6 py-7 lg:px-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
          Workout Prescription
        </p>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Sets, reps, weight and rest are
          defined per workout, not in the
          Exercise Library.
        </p>
      </section>

      <section className="border border-red-200 px-6 py-7 lg:px-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-red-700">
          Danger Zone
        </p>

        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Delete exercise
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Permanently remove this exercise from
              your exercise library. This action
              cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsDeleteDialogOpen(true)
            }
            className="min-h-11 shrink-0 bg-red-700 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-red-800"
          >
            Delete Exercise
          </button>
        </div>
      </section>

      {isDeleteDialogOpen && (
        <AdminDeleteExerciseDialog
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          onClose={() =>
            setIsDeleteDialogOpen(false)
          }
          onDeleted={() => {
            navigate("/admin/exercises", {
              replace: true,
            });
          }}
        />
      )}
    </div>
  );
}

export default AdminExerciseDetailPage;