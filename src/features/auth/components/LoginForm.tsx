import { useQueryClient } from "@tanstack/react-query"
import { authSessionQueryKey } from "../hooks/useAuthSession"
import type { AuthUser } from "../types/authUser"
import { programReturnTo } from '../../public/utils/programDestination'
import { ArrowRight } from 'lucide-react'
import { authInput, authLabel, authLink, authSubmit } from './authStyles'
import PasswordVisibilityButton from './PasswordVisibilityButton'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { ApiError } from '../../../services/apiClient'
import { useLoginMutation } from '../hooks/useLoginMutation'
import {
  loginSchema,
  type LoginFormData,
} from '../schemas/loginSchema'

function LoginForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const returnTo = programReturnTo(useLocation().search)
  const loginMutation = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      await loginMutation.mutateAsync(data)
      const user = queryClient.getQueryData<AuthUser | null>(authSessionQueryKey)
      navigate(user?.role === 'ADMIN' ? '/admin' : (returnTo ?? '/app'))
    } catch {
      // Mutation state handles the error presentation below.
    }
  }

  const invalidCredentials =
    loginMutation.error instanceof ApiError &&
    loginMutation.error.status === 401

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
          disabled={loginMutation.isPending}
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
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={loginMutation.isPending}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'password-error' : undefined
            }
            className={authInput + ' pr-12'}
            {...register('password')}
          />

          <PasswordVisibilityButton shown={showPassword} onToggle={() => setShowPassword(current => !current)} disabled={loginMutation.isPending} />
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

      <div className="-mt-3 flex justify-end">
        <Link to="/forgot-password" className={authLink + ' text-sm'}>Forgot password?</Link>
      </div>

      {loginMutation.isError && (
        <p
          role="alert"
          className="text-sm text-red-700"
        >
          {invalidCredentials
            ? 'Email or password is incorrect.'
            : 'We could not sign you in. Please try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className={authSubmit}
      >
        <span className="font-[Georgia,serif] text-xl">{loginMutation.isPending ? 'Signing in...' : 'Sign in'}</span>
        <ArrowRight size={19} aria-hidden="true" />
      </button>
    </form>
  )
}

export default LoginForm