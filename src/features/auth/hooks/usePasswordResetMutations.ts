import { useMutation } from '@tanstack/react-query'
import { forgotPassword, resetPassword } from '../api/passwordReset'

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: forgotPassword })
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPassword })
}
