import { z } from "zod";

import { safeExternalUrl } from "../../../utils/safeExternalUrl";
import { structurePositionSchema } from "./programStructureSchema";

export const programResourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be 150 characters or fewer."),

  description: z.string().trim(),

  url: z
    .string()
    .trim()
    .min(1, "URL is required.")
    .max(2048, "URL must be 2048 characters or fewer.")
    .refine(
      (value) => safeExternalUrl(value) !== null,
      "Enter a valid URL starting with http:// or https://.",
    ),

  position: structurePositionSchema,
});

export type ProgramResourceFormData = z.infer<
  typeof programResourceSchema
>;