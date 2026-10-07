import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.')
      .max(320, 'Email is too long.'),

    password: z
      .string()
      .min(1, 'Password is required.')
      .min(8, 'Password must be at least 8 characters.')
      .max(72, 'Password must be at most 72 characters.'),

    confirmPassword: z
      .string()
      .min(1, 'Confirm your password.'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    },
  )

export type RegisterFormData = z.infer<typeof registerSchema>