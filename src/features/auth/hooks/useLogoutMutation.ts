import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logout } from '../api/logout'
import { authSessionQueryKey } from './useAuthSession'

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.setQueryData(authSessionQueryKey, null)
    },
  })
}