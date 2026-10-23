import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError } from "../../../services/apiClient";
import { useUpdateAdminProgramMutation } from "../hooks/useUpdateAdminProgramMutation";
import type { AdminProgram } from "../types/adminDashboard";

const updateProgramSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Program name is required.")
    .max(
      150,
      "Program name must be 150 characters or fewer.",
    ),

  description: z.string().trim(),
});

type UpdateProgramFormData = z.infer<
  typeof updateProgramSchema
>;

type AdminProgramDetailsCardProps = {
  program: AdminProgram;
};

function AdminProgramDetailsCard({
  program,
}: AdminProgramDetailsCardProps) {
  const [isEditing, setIsEditing] =
    useState(false);

  const updateProgramMutation =
    useUpdateAdminProgramMutation({
      programId: program.id,
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProgramFormData>({
    resolver: zodResolver(
      updateProgramSchema,
    ),
    defaultValues: {
      name: program.name,
      description: program.description ?? "",
    },
  });

  function handleStartEditing() {
    reset({
      name: program.name,
      description: program.description ?? "",
    });

    updateProgramMutation.reset();
    setIsEditing(true);
  }

  function handleCancelEditing() {
    reset({
      name: program.name,
      description: program.description ?? "",
    });

    updateProgramMutation.reset();
    setIsEditing(false);
  }

  async function handleSave(
    data: UpdateProgramFormData,
  ) {
    try {
      const updatedProgram =
        await updateProgramMutation.mutateAsync({
          name: data.name.trim(),
          description:
            data.description.trim() || null,
        });

      reset({
        name: updatedProgram.name,
        description:
          updatedProgram.description ?? "",
      });

      setIsEditing(false);
    } catch {
      // Mutation error is displayed below.
    }
  }

  const errorMessage =
    updateProgramMutation.error instanceof
      ApiError &&
    updateProgramMutation.error.status === 400
      ? "Review the program information and try again."
      : "Unable to update the program. Please try again.";

  return (
    <section className="border border-border bg-background p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark">
          Program details
        </p>

        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEditing}
            className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark transition hover:text-foreground"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSubmit(handleSave)}
          className="mt-6"
          noValidate
        >
          {updateProgramMutation.isError && (
            <div
              role="alert"
              className="mb-5 border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm text-red-700">
                {errorMessage}
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="edit-program-name"
              className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
            >
              Program name
            </label>

            <input
              id="edit-program-name"
              type="text"
              disabled={
                updateProgramMutation.isPending
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
              htmlFor="edit-program-description"
              className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
            >
              Description
            </label>

            <textarea
              id="edit-program-description"
              rows={6}
              disabled={
                updateProgramMutation.isPending
              }
              {...register("description")}
              className="mt-2 w-full resize-none border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary-dark disabled:opacity-50"
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancelEditing}
              disabled={
                updateProgramMutation.isPending
              }
              className="min-h-11 border border-border px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary-dark disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                updateProgramMutation.isPending
              }
              className="min-h-11 bg-primary-dark px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateProgramMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Name
            </p>

            <p className="mt-2 text-sm font-medium text-foreground">
              {program.name}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {program.description ??
                "No description"}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminProgramDetailsCard;