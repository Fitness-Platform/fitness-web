import { z } from "zod";
import { structurePositionSchema } from "./programStructureSchema";

export const programResourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be 150 characters or fewer."),
  description: z.string().trim(),
  // The backend accepts any nonblank URL string; keep that validation contract.
  url: z
    .string()
    .trim()
    .min(1, "URL is required.")
    .max(2048, "URL must be 2048 characters or fewer."),
  position: structurePositionSchema,
});
export type ProgramResourceFormData = z.infer<typeof programResourceSchema>;
