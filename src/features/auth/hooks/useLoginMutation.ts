import { useMutation, useQueryClient } from '@tanstack/react-query'

import { login } from '../api/login'
import { getCurrentUser } from '../api/getCurrentUser'
import { authSessionQueryKey } from './useAuthSession'

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,

    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['member'] })
      await queryClient.fetchQuery({
        queryKey: authSessionQueryKey,
        queryFn: getCurrentUser,
      })
    },
  })
}