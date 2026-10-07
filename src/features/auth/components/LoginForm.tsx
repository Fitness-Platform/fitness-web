import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ApiError } from '../../../services/apiClient'
import { useLoginMutation } from '../hooks/useLoginMutation'
import {
  loginSchema,
  type LoginFormData,
} from '../schemas/loginSchema'

function LoginForm() {
  const navigate = useNavigate()
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
      navigate('/')
    } catch {
      // Mutation state handles the error presentation below.
    }
  }

  const invalidCredentials =
    loginMutation.error instanceof ApiError &&
    loginMutation.error.status === 401

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
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
          className="w-full border border-border bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
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
          className="mb-2 block text-sm font-medium"
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
            className="w-full border border-border bg-transparent px-3 py-2.5 pr-12 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            {...register('password')}
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={loginMutation.isPending}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                <path d="M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 5.5 9 5.5a15.6 15.6 0 01-3.2 3.8" />
                <path d="M6.2 6.2C4.1 7.6 3 9.5 3 9.5S6.5 15 12 15c.7 0 1.4-.1 2-.2" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </button>
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
        className="w-full bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}

export default LoginForm