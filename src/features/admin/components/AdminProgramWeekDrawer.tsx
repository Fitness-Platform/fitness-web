import {
  positionMutationError,
  weekPositionMessage,
} from "../utils/programStructureMessages";
import { structurePositionSchema } from "../schemas/programStructureSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useAdminProgramWeeksQuery,
  useAdminProgramStructureMutation,
} from "../hooks/useAdminProgramStructure";
import type { AdminProgramWeek } from "../types/adminProgramStructure";
import AdminStructureDialog from "./AdminStructureDialog";
import {
  structureCancel,
  structureInput,
  structureLabel,
  structurePrimary,
} from "./programStructureStyles";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be 150 characters or fewer."),
  description: z.string().trim(),
  position: structurePositionSchema,
});
type FormData = z.infer<typeof schema>;

export default function AdminProgramWeekDrawer({
  programId,
  week,
  nextPosition,
  onClose,
  onCreated,
}: {
  programId: string;
  week?: AdminProgramWeek;
  nextPosition: number;
  onClose: () => void;
  onCreated: (position: number) => void;
}) {
  const mutation = useAdminProgramStructureMutation(programId);
  const weeks = useAdminProgramWeeksQuery(programId);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: week?.title ?? "",
      description: week?.description ?? "",
      position: String(week?.position ?? nextPosition),
    },
  });
  async function submit(data: FormData) {
    const request = {
      title: data.title,
      description: data.description || null,
      position: Number(data.position),
    };
    mutation.reset();
    if (
      weeks.data?.some(
        (item) => item.position === request.position && item.id !== week?.id,
      )
    ) {
      setError(
        "position",
        {
          message: weekPositionMessage(request.position, weeks.data, week?.id),
        },
        { shouldFocus: true },
      );
      return;
    }
    try {
      await mutation.mutateAsync(
        week
          ? { action: "updateWeek", weekId: week.id, request }
          : { action: "createWeek", request },
      );
      if (!week) onCreated(request.position);
      onClose();
    } catch {
      /* Mutation errors are rendered in the drawer. */
    }
  }
  return (
    <AdminStructureDialog
      drawer
      title={week ? "Edit Week" : "Add Week"}
      description="Define this week’s title, description and position in the program."
      pending={mutation.isPending}
      onClose={onClose}
    >
      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-7 sm:px-8">
          <fieldset disabled={mutation.isPending} className="space-y-6">
            <div>
              <label className={structureLabel} htmlFor="week-title">
                Title *
              </label>
              <input
                id="week-title"
                className={structureInput}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "week-title-error" : undefined}
                {...register("title")}
              />
              {errors.title && (
                <p id="week-title-error" className="mt-2 text-xs text-red-700">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className={structureLabel} htmlFor="week-description">
                Description
              </label>
              <textarea
                id="week-description"
                rows={5}
                className={structureInput}
                {...register("description")}
              />
            </div>
            <div>
              <label className={structureLabel} htmlFor="week-position">
                Position *
              </label>
              <input
                id="week-position"
                type="number"
                min={1}
                step={1}
                className={structureInput}
                aria-invalid={Boolean(errors.position)}
                aria-describedby="week-position-help week-position-error"
                {...register("position")}
              />
              <p
                id="week-position-help"
                className="mt-2 text-xs leading-5 text-muted-foreground"
              >
                Choose an unused position. Week 1 starts with program access;
                each additional position adds 7 days to availability.
              </p>
              <p id="week-position-error" className="mt-2 text-xs text-red-700">
                {errors.position?.message}
              </p>
            </div>
          </fieldset>
          {mutation.isError && (
            <p role="alert" className="text-sm text-red-700">
              {positionMutationError(
                mutation.error,
                weekPositionMessage(
                  mutation.variables && "request" in mutation.variables
                    ? mutation.variables.request.position
                    : Number(week?.position ?? nextPosition),
                  weeks.data ?? [],
                  week?.id,
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
          <button className={structurePrimary} disabled={mutation.isPending}>
            {mutation.isPending
              ? "Saving..."
              : week
                ? "Save Changes"
                : "Add Week"}
          </button>
        </footer>
      </form>
    </AdminStructureDialog>
  );
}
