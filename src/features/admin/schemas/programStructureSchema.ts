import { z } from "zod";

export const structurePositionSchema = z
  .string()
  .trim()
  .min(1, "Position is required.")
  .refine(
    (value) =>
      /^\d+$/.test(value) && Number(value) > 0 && Number(value) <= 2147483647,
    "Enter a positive whole number up to 2147483647.",
  );
