export type MemberProgramSummary = {
  programId: string
  name: string
  description: string | null
  accessStartsAt: string
  accessExpiresAt: string | null
}