import { apiRequest } from '../../../services/apiClient'
import type { MemberProgramDetail } from '../types/memberProgramDetail'

export function getMyProgram(
  programId: string,
): Promise<MemberProgramDetail> {
  return apiRequest<MemberProgramDetail>(
    `/api/me/programs/${programId}`,
  )
}