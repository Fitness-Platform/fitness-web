import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { ApiError } from '../../../services/apiClient'
import AuthLayout from '../components/AuthLayout'
import PasswordVisibilityButton from '../components/PasswordVisibilityButton'
import { authInput, authLabel, authLink, authSubmit } from '../components/authStyles'
import { useResetPasswordMutation } from '../hooks/usePasswordResetMutations'
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/passwordResetSchema'

function ResetPasswordForm({ token }: { token: string }) {
  const mutation = useResetPasswordMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema), defaultValues: { newPassword: '', confirmPassword: '' },
  })
  const invalidToken = mutation.error instanceof ApiError && mutation.error.status === 400

  if (mutation.isSuccess) {
    return <p role="status" className="text-center text-sm leading-7">Your password has been reset. You can now sign in with your new password.</p>
  }

  return (
    <form noValidate className="space-y-7" onSubmit={handleSubmit(data => mutation.mutate({ token, newPassword: data.newPassword }))}>
      <div>
        <label htmlFor="newPassword" className={authLabel}>New password</label>
        <div className="relative">
          <input id="newPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a password" className={authInput + ' pr-12'} disabled={mutation.isPending} aria-invalid={Boolean(errors.newPassword)} aria-describedby={errors.newPassword ? 'new-password-error' : undefined} {...register('newPassword')} />
          <PasswordVisibilityButton shown={showPassword} onToggle={() => setShowPassword(value => !value)} disabled={mutation.isPending} label="new password" />
        </div>
        {errors.newPassword && <p id="new-password-error" className="mt-2 text-sm text-red-700">{errors.newPassword.message}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword" className={authLabel}>Confirm password</label>
        <div className="relative">
          <input id="confirmPassword" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm your password" className={authInput + ' pr-12'} disabled={mutation.isPending} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined} {...register('confirmPassword')} />
          <PasswordVisibilityButton shown={showConfirmation} onToggle={() => setShowConfirmation(value => !value)} disabled={mutation.isPending} label="confirm password" />
        </div>
        {errors.confirmPassword && <p id="confirm-password-error" className="mt-2 text-sm text-red-700">{errors.confirmPassword.message}</p>}
      </div>
      {mutation.isError && (
        <div role="alert" className="text-sm leading-6 text-red-700">
          <p>{invalidToken ? 'This reset link is invalid, expired, or has already been used.' : 'We could not reset your password. Please try again.'}</p>
          {invalidToken && <Link to="/forgot-password" className={authLink}>Request a new reset link</Link>}
        </div>
      )}
      <button type="submit" className={authSubmit} disabled={mutation.isPending}>
        <span className="font-[Georgia,serif] text-xl">{mutation.isPending ? 'Resetting password...' : 'Reset password'}</span><ArrowRight size={19} aria-hidden="true" />
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''

  return (
    <AuthLayout title="Reset your password" description="Choose a new password for your account." alternative="Back to your account?" linkText="Sign in" linkTo="/login">
      {token.trim() ? <ResetPasswordForm key={token} token={token} /> : (
        <div role="alert" className="text-center text-sm leading-7">
          <p>This reset link is missing a token. Request a new link to reset your password.</p>
          <Link to="/forgot-password" className={authLink}>Request a new reset link</Link>
        </div>
      )}
    </AuthLayout>
  )
}
