import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { ApiError } from '../../../services/apiClient'
import { useRegisterMutation } from '../hooks/useRegisterMutation'
import {
  registerSchema,
  type RegisterFormData,
} from '../schemas/registerSchema'

function RegisterForm() {
  const navigate = useNavigate()
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

      navigate('/login')
    } catch {
      // Mutation state handles the error presentation below.
    }
  }

  const conflict =
    registerMutation.error instanceof ApiError &&
    registerMutation.error.status === 409

  return (
    <>
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
            disabled={registerMutation.isPending}
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

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            disabled={registerMutation.isPending}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'password-error' : undefined
            }
            className="w-full border border-border bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            {...register('password')}
          />

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
            className="mb-2 block text-sm font-medium"
          >
            Confirm password
          </label>

          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            disabled={registerMutation.isPending}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={
              errors.confirmPassword
                ? 'confirm-password-error'
                : undefined
            }
            className="w-full border border-border bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            {...register('confirmPassword')}
          />

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
          className="w-full bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-background transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {registerMutation.isPending
            ? 'Creating account...'
            : 'Create account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-foreground hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  )
}

export default RegisterForm