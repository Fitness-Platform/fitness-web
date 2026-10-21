import { getCsrfToken } from '../../auth/api/getCsrfToken'
import { apiRequest } from '../../../services/apiClient'

export type MemberWorkoutCompletion = {
  programAccessWorkoutId: string
  programWeekWorkoutId: string
  startedAt: string
  completedAt: string
}

type CompleteMyWorkoutParams = {
  programId: string
  weekId: string
  programWeekWorkoutId: string
}

export async function completeMyWorkout({
  programId,
  weekId,
  programWeekWorkoutId,
}: CompleteMyWorkoutParams): Promise<MemberWorkoutCompletion> {
  const csrf = await getCsrfToken()

  return apiRequest<MemberWorkoutCompletion>(
    `/api/me/programs/${programId}`
      + `/weeks/${weekId}`
      + `/workouts/${programWeekWorkoutId}`
      + '/complete',
    {
      method: 'POST',
      headers: {
        [csrf.headerName]: csrf.token,
      },
    },
  )
}