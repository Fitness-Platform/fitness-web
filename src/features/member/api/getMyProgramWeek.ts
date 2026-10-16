import { apiRequest } from '../../../services/apiClient'

import type { MemberProgramWeekDetail } from '../types/memberProgramWeekDetail'

export function getMyProgramWeek(
  programId: string,
  weekId: string,
): Promise<MemberProgramWeekDetail> {
  return apiRequest<MemberProgramWeekDetail>(
    `/api/me/programs/${programId}/weeks/${weekId}`,
  )
}