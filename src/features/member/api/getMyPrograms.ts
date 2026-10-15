import { apiRequest } from '../../../services/apiClient'
import type { MemberProgramSummary } from '../types/memberProgram'

export function getMyPrograms(): Promise<MemberProgramSummary[]> {
  return apiRequest<MemberProgramSummary[]>('/api/me/programs')
}