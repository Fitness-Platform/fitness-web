import {
  positionMutationError,
  workoutPositionMessage,
} from "../utils/programStructureMessages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useAdminProgramWeekWorkoutsQuery,
  useAdminProgramStructureMutation,
} from "../hooks/useAdminProgramStructure";
import { useAdminWorkoutsQuery } from "../hooks/useAdminWorkoutsQuery";
import type { AdminProgramWeekWorkout } from "../types/adminProgramStructure";
import AdminStructureDialog from "./AdminStructureDialog";
import { structurePositionSchema } from "../schemas/programStructureSchema";
import {
  structureButton,
  structureCancel,
  structureInput,
  structureLabel,
  structurePrimary,
} from "./programStructureStyles";

const schema = z.object({
  workoutId: z.string().min(1, "Select a workout."),
  position: structurePositionSchema,
});
type FormData = z.infer<typeof schema>;

export default function AdminAssignProgramWorkoutDrawer({
  programId,
  weekId,
  weekPosition,
  assignment,
  nextPosition,
  onClose,
}: {
  programId: string;
  weekId: string;
  weekPosition: number;
  assignment?: AdminProgramWeekWorkout;
  nextPosition: number;
  onClose: () => void;
}) {
  const mutation = useAdminProgramStructureMutation(programId);
  const library = useAdminWorkoutsQuery();
  const assignments = useAdminProgramWeekWorkoutsQuery(programId, weekId);
  const [search, setSearch] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workoutId: assignment?.workoutId ?? "",
      position: String(assignment?.position ?? nextPosition),
    },
  });
  const workouts =
    library.data?.filter((workout) =>
      `${workout.name} ${workout.description ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ) ?? [];
  async function submit(data: FormData) {
    mutation.reset();
    if (
      assignments.data?.some(
        (item) =>
          item.position === Number(data.position) && item.id !== assignment?.id,
      )
    ) {
      setError(
        "position",
        {
          message: workoutPositionMessage(
            Number(data.position),
            weekPosition,
            assignments.data,
            library.data ?? [],
            assignment?.id,
          ),
        },
        { shouldFocus: true },
      );
      return;
    }
    try {
      await mutation.mutateAsync(
        assignment
          ? {
              action: "updateWorkout",
              weekId,
              assignmentId: assignment.id,
              request: { position: Number(data.position) },
            }
          : {
              action: "assignWorkout",
              weekId,
              request: {
                workoutId: data.workoutId,
                position: Number(data.position),
              },
            },
      );
      onClose();
    } catch {
      /* Mutation errors are rendered below. */
    }
  }
  return (
    <AdminStructureDialog
      drawer
      title={assignment ? "Edit Workout Position" : "Add Workout"}
      description={
        assignment
          ? "Update the order of this workout within the week."
          : "Select an existing workout from your library and define its position."
      }
      pending={mutation.isPending}
      onClose={onClose}
    >
      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-7 sm:px-8">
          <fieldset disabled={mutation.isPending} className="space-y-7">
            {assignment ? (
              <p className="border border-border p-4 text-sm">
                {library.data?.find((item) => item.id === assignment.workoutId)
                  ?.name ?? "Workout details unavailable"}
              </p>
            ) : (
              <div>
                <label htmlFor="workout-search" className={structureLabel}>
                  Search Workout Library
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    aria-hidden="true"
                    className="absolute left-3 top-6 text-muted-foreground"
                  />
                  <input
                    id="workout-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className={structureInput + " pl-10"}
                    placeholder="Search workouts"
                  />
                </div>
                <fieldset className="mt-5">
                  <legend className={structureLabel}>Select workout *</legend>
                  {library.isPending ? (
                    <p
                      role="status"
                      className="mt-3 text-sm text-muted-foreground"
                    >
                      Loading workouts...
                    </p>
                  ) : library.isError ? (
                    <div role="alert" className="mt-3 text-sm text-red-700">
                      <p>Unable to load the Workout Library.</p>
                      <button
                        type="button"
                        onClick={() => library.refetch()}
                        className={structureButton + " mt-3"}
                      >
                        Try again
                      </button>
                    </div>
                  ) : !workouts.length ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {library.data?.length
                        ? "No workouts match your search."
                        : "No workouts in the library. Create a workout under Admin → Workouts first."}
                    </p>
                  ) : (
                    <div className="mt-3 max-h-72 space-y-3 overflow-y-auto">
                      {workouts.map((workout) => (
                        <label
                          key={workout.id}
                          className="flex cursor-pointer items-start gap-3 border border-border p-4 has-[:checked]:border-primary-dark has-[:checked]:bg-primary/5"
                        >
                          <input
                            type="radio"
                            value={workout.id}
                            className="mt-1 accent-primary-dark"
                            aria-invalid={Boolean(errors.workoutId)}
                            aria-describedby={
                              errors.workoutId
                                ? "workout-selection-error"
                                : undefined
                            }
                            {...register("workoutId")}
                          />
                          <span className="min-w-0 break-words text-sm">
                            <span className="block font-medium">
                              {workout.name}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                              {workout.description ?? "No description"}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </fieldset>
                {errors.workoutId && (
                  <p
                    id="workout-selection-error"
                    className="mt-2 text-xs text-red-700"
                  >
                    {errors.workoutId.message}
                  </p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="assignment-position" className={structureLabel}>
                Position *
              </label>
              <input
                id="assignment-position"
                type="number"
                min={1}
                step={1}
                className={structureInput}
                aria-invalid={Boolean(errors.position)}
                aria-describedby="assignment-position-help assignment-position-error"
                {...register("position")}
              />
              <p
                id="assignment-position-help"
                className="mt-2 text-xs leading-5 text-muted-foreground"
              >
                Choose an unused position in this week. To swap occupied
                positions, move one workout to an unused position first.
              </p>
              <p
                id="assignment-position-error"
                className="mt-2 text-xs text-red-700"
              >
                {errors.position?.message}
              </p>
            </div>
          </fieldset>
          {mutation.isError && (
            <p role="alert" className="text-sm text-red-700">
              {positionMutationError(
                mutation.error,
                workoutPositionMessage(
                  mutation.variables && "request" in mutation.variables
                    ? mutation.variables.request.position
                    : Number(assignment?.position ?? nextPosition),
                  weekPosition,
                  assignments.data ?? [],
                  library.data ?? [],
                  assignment?.id,
                ),
              )}
            </p>
          )}
        </div>
        <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-border px-6 py-5 sm:px-8">
          <button
            type="button"
            className={structureCancel}
            disabled={mutation.isPending}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={structurePrimary}
            disabled={
              mutation.isPending ||
              (!assignment &&
                (library.isPending || library.isError || !library.data?.length))
            }
          >
            {mutation.isPending
              ? "Saving..."
              : assignment
                ? "Save Changes"
                : "Add to Week"}
          </button>
        </footer>
      </form>
    </AdminStructureDialog>
  );
}
