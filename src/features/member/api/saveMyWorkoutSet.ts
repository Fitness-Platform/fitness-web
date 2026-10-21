import { getCsrfToken } from '../../auth/api/getCsrfToken'
import { apiRequest } from '../../../services/apiClient'

import type { MemberWorkoutSet } from '../types/memberProgramWorkoutDetail'

export type SaveMyWorkoutSetRequest = {
  reps: number
  weightLb: number
}

type SaveMyWorkoutSetParams = {
  programId: string
  weekId: string
  programWeekWorkoutId: string
  workoutExerciseId: string
  setNumber: number
  request: SaveMyWorkoutSetRequest
}

export async function saveMyWorkoutSet({
  programId,
  weekId,
  programWeekWorkoutId,
  workoutExerciseId,
  setNumber,
  request,
}: SaveMyWorkoutSetParams): Promise<MemberWorkoutSet> {
  const csrf = await getCsrfToken()

  return apiRequest<MemberWorkoutSet>(
    `/api/me/programs/${programId}`
      + `/weeks/${weekId}`
      + `/workouts/${programWeekWorkoutId}`
      + `/exercises/${workoutExerciseId}`
      + `/sets/${setNumber}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        [csrf.headerName]: csrf.token,
      },
      body: JSON.stringify(request),
    },
  )
}