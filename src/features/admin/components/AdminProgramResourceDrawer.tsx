import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useAdminProgramResourceMutation,
  useAdminProgramResourcesQuery,
} from "../hooks/useAdminProgramResources";
import {
  programResourceSchema,
  type ProgramResourceFormData,
} from "../schemas/programResourceSchema";
import type { AdminProgramResource } from "../types/adminProgramResource";
import { resourcePositionMessage } from "../utils/programResourceMessages";
import { positionMutationError } from "../utils/programStructureMessages";
import AdminStructureDialog from "./AdminStructureDialog";
import {
  structureCancel,
  structureInput,
  structureLabel,
  structurePrimary,
} from "./programStructureStyles";

export default function AdminProgramResourceDrawer({
  programId,
  resource,
  nextPosition,
  onClose,
}: {
  programId: string;
  resource?: AdminProgramResource;
  nextPosition: number;
  onClose: () => void;
}) {
  const mutation = useAdminProgramResourceMutation(programId);
  const resources = useAdminProgramResourcesQuery(programId);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProgramResourceFormData>({
    resolver: zodResolver(programResourceSchema),
    defaultValues: {
      title: resource?.title ?? "",
      description: resource?.description ?? "",
      url: resource?.url ?? "",
      position: String(resource?.position ?? nextPosition),
    },
  });
  async function submit(data: ProgramResourceFormData) {
    const request = {
      title: data.title,
      description: data.description || null,
      url: data.url,
      position: Number(data.position),
    };
    mutation.reset();
    if (
      resources.data?.some(
        (item) =>
          item.position === request.position && item.id !== resource?.id,
      )
    ) {
      setError(
        "position",
        {
          message: resourcePositionMessage(
            request.position,
            resources.data,
            resource?.id,
          ),
        },
        { shouldFocus: true },
      );
      return;
    }
    try {
      await mutation.mutateAsync(
        resource
          ? { action: "update", resourceId: resource.id, request }
          : { action: "create", request },
      );
      onClose();
    } catch {
      /* Mutation errors remain visible in the drawer. */
    }
  }
  return (
    <AdminStructureDialog
      drawer
      eyebrow="Program Resources"
      title={resource ? "Edit Resource" : "Add Resource"}
      description="Add supporting links or materials for this program."
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
              <label className={structureLabel} htmlFor="resource-title">
                Title *
              </label>
              <input
                id="resource-title"
                className={structureInput}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "resource-title-error" : undefined
                }
                {...register("title")}
              />
              {errors.title && (
                <p
                  id="resource-title-error"
                  className="mt-2 text-xs text-red-700"
                >
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className={structureLabel} htmlFor="resource-description">
                Description
              </label>
              <textarea
                id="resource-description"
                rows={4}
                className={structureInput}
                {...register("description")}
              />
            </div>
            <div>
              <label className={structureLabel} htmlFor="resource-url">
                URL *
              </label>
              <input
                id="resource-url"
                type="text"
                inputMode="url"
                className={structureInput}
                placeholder="https://..."
                aria-invalid={Boolean(errors.url)}
                aria-describedby={errors.url ? "resource-url-error" : undefined}
                {...register("url")}
              />
              {errors.url && (
                <p
                  id="resource-url-error"
                  className="mt-2 text-xs text-red-700"
                >
                  {errors.url.message}
                </p>
              )}
            </div>
            <div>
              <label className={structureLabel} htmlFor="resource-position">
                Position *
              </label>
              <input
                id="resource-position"
                type="number"
                min={1}
                step={1}
                className={structureInput}
                aria-invalid={Boolean(errors.position)}
                aria-describedby="resource-position-help resource-position-error"
                {...register("position")}
              />
              <p
                id="resource-position-help"
                className="mt-2 text-xs leading-5 text-muted-foreground"
              >
                Choose an unused position in this program. Move a resource to an
                unused position before swapping occupied positions.
              </p>
              <p
                id="resource-position-error"
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
                resourcePositionMessage(
                  mutation.variables && "request" in mutation.variables
                    ? mutation.variables.request.position
                    : Number(resource?.position ?? nextPosition),
                  resources.data ?? [],
                  resource?.id,
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
            type="submit"
            className={structurePrimary}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : resource
                ? "Save Changes"
                : "Add Resource"}
          </button>
        </footer>
      </form>
    </AdminStructureDialog>
  );
}
