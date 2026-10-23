import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createAdminProgram,
  type CreateAdminProgramRequest,
} from '../api/createAdminProgram'
import { adminDashboardQueryKey } from './useAdminDashboardQuery'
import { adminProgramsQueryKey } from './useAdminProgramsQuery'

export function useCreateAdminProgramMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      request: CreateAdminProgramRequest,
    ) => createAdminProgram(request),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminProgramsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: adminDashboardQueryKey,
        }),
      ])
    },
  })
}