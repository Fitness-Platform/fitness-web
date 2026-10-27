import { z } from "zod";

const validDate = (value: string) =>
  value !== "" && Number.isFinite(new Date(value).getTime());
export const grantAccessSchema = z
  .object({
    userId: z.string().min(1, "Select a client."),
    programId: z.string().min(1, "Select a program."),
    startsAt: z
      .string()
      .refine(validDate, "Choose a valid start date and time."),
    expiresAt: z
      .string()
      .refine(
        (value) => value === "" || validDate(value),
        "Choose a valid expiration date and time.",
      ),
  })
  .refine(
    (data) =>
      !data.expiresAt ||
      !validDate(data.startsAt) ||
      new Date(data.expiresAt).getTime() > new Date(data.startsAt).getTime(),
    {
      message: "Expiration must be strictly after the start time.",
      path: ["expiresAt"],
    },
  );
export type GrantAccessFormData = z.infer<typeof grantAccessSchema>;
