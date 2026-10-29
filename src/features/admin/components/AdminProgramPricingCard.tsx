import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError } from "../../../services/apiClient";
import { useUpdateAdminProgramPricingMutation } from "../hooks/useUpdateAdminProgramPricingMutation";
import type { AdminProgram } from "../types/adminDashboard";

const pricingSchema = z.object({
  price: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d+([.,]\d{1,2})?$/.test(value),
      "Enter a valid price with up to 2 decimal places.",
    )
    .refine((value) => {
      if (value === "") {
        return true;
      }

      const normalized = value.replace(",", ".");

      return Number(normalized) > 0;
    }, "Price must be greater than zero."),
});

type PricingFormData = z.infer<typeof pricingSchema>;

type AdminProgramPricingCardProps = {
  program: AdminProgram;
};

function formatPriceInput(priceCents: number | null) {
  if (priceCents === null) {
    return "";
  }

  return (priceCents / 100).toFixed(2);
}

function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);
}

function dollarsToCents(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (normalized === "") {
    return null;
  }

  const [wholePart, decimalPart = ""] = normalized.split(".");

  const dollars = Number(wholePart);
  const cents = Number(decimalPart.padEnd(2, "0"));

  return dollars * 100 + cents;
}

function AdminProgramPricingCard({ program }: AdminProgramPricingCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const updatePricingMutation = useUpdateAdminProgramPricingMutation({
    programId: program.id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      price: formatPriceInput(program.priceCents),
    },
  });

  function handleStartEditing() {
    reset({
      price: formatPriceInput(program.priceCents),
    });

    updatePricingMutation.reset();
    setIsEditing(true);
  }

  function handleCancelEditing() {
    reset({
      price: formatPriceInput(program.priceCents),
    });

    updatePricingMutation.reset();
    setIsEditing(false);
  }

  async function handleSave(data: PricingFormData) {
    try {
      const updatedProgram = await updatePricingMutation.mutateAsync({
        priceCents: dollarsToCents(data.price),
      });

      reset({
        price: formatPriceInput(updatedProgram.priceCents),
      });

      setIsEditing(false);
    } catch {
      // Mutation error is displayed below.
    }
  }

  const errorMessage =
    updatePricingMutation.error instanceof ApiError &&
    updatePricingMutation.error.status === 400
      ? "Enter a valid price greater than zero."
      : "Unable to update pricing. Please try again.";

  return (
    <section className="border border-border bg-background p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark">
          Pricing
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
        <form onSubmit={handleSubmit(handleSave)} className="mt-5" noValidate>
          {updatePricingMutation.isError && (
            <div
              role="alert"
              className="mb-5 border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-xs text-red-700">{errorMessage}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="program-price"
              className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
            >
              Price
            </label>

            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>

              <input
                id="program-price"
                type="text"
                inputMode="decimal"
                disabled={updatePricingMutation.isPending}
                {...register("price")}
                className="h-12 w-full border border-border bg-background pl-8 pr-16 text-sm text-foreground outline-none transition focus:border-primary-dark disabled:opacity-50"
                placeholder="49.99"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                USD
              </span>
            </div>

            {errors.price && (
              <p className="mt-2 text-xs text-red-700">
                {errors.price.message}
              </p>
            )}
          </div>

          <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
            Leave the price empty to remove pricing from this program.
          </p>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancelEditing}
              disabled={updatePricingMutation.isPending}
              className="admin-secondary-action min-h-10 border border-border px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-foreground transition hover:border-primary-dark disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updatePricingMutation.isPending}
              className="min-h-10 bg-primary-dark px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updatePricingMutation.isPending ? "Saving..." : "Save Pricing"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4">
          {program.priceCents === null ? (
            <>
              <p className="text-2xl font-semibold text-foreground">Not set</p>

              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                USD
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(program.priceCents)}
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                USD
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default AdminProgramPricingCard;
