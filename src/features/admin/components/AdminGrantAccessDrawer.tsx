import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminProgramsQuery } from "../hooks/useAdminProgramsQuery";
import { useGrantAdminProgramAccessMutation } from "../hooks/useAdminProgramAccesses";
import {
  grantAccessSchema,
  type GrantAccessFormData,
} from "../schemas/grantAccessSchema";
import type { AdminProgramAccess } from "../types/adminDashboard";
import type { AdminUser } from "../types/adminUser";
import { accessError, localDateTime } from "../utils/programAccess";
import AdminStructureDialog from "./AdminStructureDialog";
import AdminUserPicker from "./AdminUserPicker";
import {
  structureButton,
  structureCancel,
  structureInput,
  structureLabel,
  structurePrimary,
} from "./programStructureStyles";

export default function AdminGrantAccessDrawer({
  initialClient,
  initialProgramId,
  onGranted,
  onClose,
}: {
  initialClient: AdminUser | null;
  initialProgramId: string;
  onGranted: (access: AdminProgramAccess) => void;
  onClose: () => void;
}) {
  const programs = useAdminProgramsQuery();
  const mutation = useGrantAdminProgramAccessMutation();
  const [client, setClient] = useState(initialClient);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GrantAccessFormData>({
    resolver: zodResolver(grantAccessSchema),
    defaultValues: {
      userId: initialClient?.id ?? "",
      programId: initialProgramId,
      startsAt: localDateTime(),
      expiresAt: "",
    },
  });
  const pending = isSubmitting || mutation.isPending;
  async function submit(data: GrantAccessFormData) {
    try {
      const access = await mutation.mutateAsync({
        userId: data.userId,
        programId: data.programId,
        startsAt: new Date(data.startsAt).toISOString(),
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : null,
      });
      onGranted(access);
      onClose();
    } catch {
      /* Mutation error is displayed below. */
    }
  }
  return (
    <AdminStructureDialog
      drawer
      eyebrow="Clients & Access"
      title="Grant Access"
      description="Give a registered client access to an existing program."
      pending={pending}
      onClose={onClose}
    >
      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-7 sm:px-8">
          <AdminUserPicker
            value={client}
            onChange={(user) => {
              setClient(user);
              setValue("userId", user?.id ?? "", { shouldValidate: true });
            }}
            disabled={pending}
            error={errors.userId?.message}
          />
          <fieldset disabled={pending} className="space-y-6">
            <div>
              <label htmlFor="access-program" className={structureLabel}>
                Program *
              </label>
              <select
                id="access-program"
                className={structureInput}
                aria-invalid={Boolean(errors.programId)}
                aria-describedby="access-program-error"
                {...register("programId")}
              >
                <option value="">Select a program</option>
                {programs.data?.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              <p
                id="access-program-error"
                className="mt-2 text-xs text-red-700"
              >
                {errors.programId?.message}
              </p>
              {programs.isPending ? (
                <p role="status" className="mt-2 text-xs text-muted-foreground">
                  Loading programs...
                </p>
              ) : programs.isError ? (
                <div role="alert" className="mt-2 text-sm text-red-700">
                  <p>Unable to load programs.</p>
                  <button
                    type="button"
                    className={structureButton + " mt-2"}
                    onClick={() => programs.refetch()}
                  >
                    Retry programs
                  </button>
                </div>
              ) : !programs.data?.length ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  No programs available. Create a program under Admin → Programs
                  first.
                </p>
              ) : null}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Dates and times use your local time zone:{" "}
              {Intl.DateTimeFormat().resolvedOptions().timeZone}.
            </p>
            <div>
              <label htmlFor="access-start" className={structureLabel}>
                Starts at *
              </label>
              <input
                id="access-start"
                type="datetime-local"
                className={structureInput + " min-w-0"}
                aria-invalid={Boolean(errors.startsAt)}
                aria-describedby="access-start-error"
                {...register("startsAt")}
              />
              <p id="access-start-error" className="mt-2 text-xs text-red-700">
                {errors.startsAt?.message}
              </p>
            </div>
            <div>
              <label htmlFor="access-expiration" className={structureLabel}>
                Expires at
              </label>
              <input
                id="access-expiration"
                type="datetime-local"
                className={structureInput + " min-w-0"}
                aria-invalid={Boolean(errors.expiresAt)}
                aria-describedby="access-expiration-help access-expiration-error"
                {...register("expiresAt")}
              />
              <p
                id="access-expiration-help"
                className="mt-2 text-xs text-muted-foreground"
              >
                Leave empty for no expiration.
              </p>
              <p
                id="access-expiration-error"
                className="mt-2 text-xs text-red-700"
              >
                {errors.expiresAt?.message}
              </p>
            </div>
          </fieldset>
          {mutation.isError && (
            <p role="alert" className="text-sm text-red-700">
              {accessError(mutation.error)}
            </p>
          )}
        </div>
        <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-border px-6 py-5 sm:px-8">
          <button
            type="button"
            className={structureCancel}
            disabled={pending}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={structurePrimary}
            disabled={
              pending ||
              programs.isPending ||
              programs.isError ||
              !programs.data?.length
            }
          >
            {pending ? "Granting..." : "Grant Access"}
          </button>
        </footer>
      </form>
    </AdminStructureDialog>
  );
}
