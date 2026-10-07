import { useMutation } from '@tanstack/react-query'

import { registerUser } from '../api/register'

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  })
}