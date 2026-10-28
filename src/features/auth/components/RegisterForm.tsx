import { authDestination, programReturnTo } from '../../public/utils/programDestination'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { authInput, authLabel, authSubmit } from './authStyles'
import PasswordVisibilityButton from './PasswordVisibilityButton'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { ApiError } from '../../../services/apiClient'
import { useRegisterMutation } from '../hooks/useRegisterMutation'
import {
  registerSchema,
  type RegisterFormData,
} from '../schemas/registerSchema'

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const returnTo = programReturnTo(useLocation().search)
  const registerMutation = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
      })

      navigate(authDestination('/login', returnTo))
    } catch {
      // Mutation state handles the error presentation below.
    }
  }

  const conflict =
    registerMutation.error instanceof ApiError &&
    registerMutation.error.status === 409

  return (
    <form
      className="space-y-7"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <label
          htmlFor="email"
          className={authLabel}
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={registerMutation.isPending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={authInput}
          {...register('email')}
        />

        {errors.email && (
          <p
            id="email-error"
            className="mt-2 text-sm text-red-700"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className={authLabel}
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a password"
            disabled={registerMutation.isPending}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'password-error' : undefined
            }
            className={authInput + ' pr-12'}
            {...register('password')}
          />
          <PasswordVisibilityButton shown={showPassword} onToggle={() => setShowPassword(current => !current)} disabled={registerMutation.isPending} label="password" />
        </div>

        {errors.password && (
          <p
            id="password-error"
            className="mt-2 text-sm text-red-700"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className={authLabel}
        >
          Confirm password
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm your password"
            disabled={registerMutation.isPending}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword
                ? 'confirm-password-error'
                : undefined
            }
            className={authInput + ' pr-12'}
            {...register('confirmPassword')}
          />
          <PasswordVisibilityButton shown={showConfirmPassword} onToggle={() => setShowConfirmPassword(current => !current)} disabled={registerMutation.isPending} label="confirm password" />
        </div>

        {errors.confirmPassword && (
          <p
            id="confirm-password-error"
            className="mt-2 text-sm text-red-700"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {registerMutation.isError && (
        <p
          role="alert"
          className="text-sm text-red-700"
        >
          {conflict
            ? 'An account with this email already exists.'
            : 'We could not create your account. Please try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className={authSubmit}
      >
        <span className="font-[Georgia,serif] text-xl">{registerMutation.isPending
          ? 'Creating account...'
          : 'Create account'}</span>
        <ArrowRight size={19} aria-hidden="true" />
      </button>
    </form>
  )
}

export default RegisterForm
