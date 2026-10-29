import { z } from "zod";

import { structurePositionSchema } from "./programStructureSchema";

export const programResourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be 150 characters or fewer."),

  description: z.string().trim(),

  position: structurePositionSchema,
});

export type ProgramResourceFormData = z.infer<
  typeof programResourceSchema
>;