export type MemberProgramResource = {
  resourceId: string
  title: string
  description: string
  url: string
  position: number
}

export type MemberProgramWeek = {
  weekId: string
  title: string
  description: string
  position: number
  unlocked: boolean
  unlocksAt: string
}

export type MemberProgramDetail = {
  programId: string
  name: string
  description: string
  accessStartsAt: string
  accessExpiresAt: string | null
  resources: MemberProgramResource[]
  weeks: MemberProgramWeek[]
}