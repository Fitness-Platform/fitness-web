import { apiRequest } from '../../../services/apiClient'

import type { MemberProgramWorkoutDetail } from '../types/memberProgramWorkoutDetail'

export function getMyProgramWorkout(
  programId: string,
  weekId: string,
  programWeekWorkoutId: string,
): Promise<MemberProgramWorkoutDetail> {
  return apiRequest<MemberProgramWorkoutDetail>(
    `/api/me/programs/${programId}/weeks/${weekId}/workouts/${programWeekWorkoutId}`,
  )
}