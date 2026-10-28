import type { PublicProgram } from "../api/getPublicProgram";

export function formatProgramPrice(
  program: Pick<PublicProgram, "priceCents" | "currency">,
): string | null {
  if (
    program.priceCents === null ||
    !Number.isSafeInteger(program.priceCents) ||
    program.priceCents <= 0 ||
    !/^[A-Z]{3}$/i.test(program.currency)
  )
    return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: program.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(program.priceCents / 100);
  } catch {
    return null;
  }
}
