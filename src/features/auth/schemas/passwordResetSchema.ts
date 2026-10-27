import { z } from 'zod'
import { registerSchema } from './registerSchema'

export const forgotPasswordSchema = z.object({ email: registerSchema.shape.email })
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  newPassword: registerSchema.shape.password,
  confirmPassword: registerSchema.shape.confirmPassword,
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
