import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import AuthLayout from '../components/AuthLayout'
import { authInput, authLabel, authSubmit } from '../components/authStyles'
import { useForgotPasswordMutation } from '../hooks/usePasswordResetMutations'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/passwordResetSchema'

export default function ForgotPasswordPage() {
  const mutation = useForgotPasswordMutation()
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' },
  })

  return (
    <AuthLayout title="Forgot your password?" description="Enter your email to request a password reset link." alternative="Remember your password?" linkText="Sign in" linkTo="/login">
      {mutation.isSuccess ? (
        <p role="status" className="text-center text-sm leading-7">If an account exists for that email, you’ll receive a password reset link. Please check your inbox.</p>
      ) : (
        <form noValidate className="space-y-7" onSubmit={handleSubmit(data => mutation.mutate(data))}>
          <div>
            <label htmlFor="email" className={authLabel}>Email</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" className={authInput} disabled={mutation.isPending} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} {...register('email')} />
            {errors.email && <p id="email-error" className="mt-2 text-sm text-red-700">{errors.email.message}</p>}
          </div>
          {mutation.isError && <p role="alert" className="text-sm text-red-700">We could not request a reset link. Please try again.</p>}
          <button type="submit" className={authSubmit} disabled={mutation.isPending}>
            <span className="font-[Georgia,serif] text-xl">{mutation.isPending ? 'Sending link...' : 'Send reset link'}</span><ArrowRight size={19} aria-hidden="true" />
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
