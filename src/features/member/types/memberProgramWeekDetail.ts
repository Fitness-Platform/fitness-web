export type MemberProgramWorkoutSummary = {
  programWeekWorkoutId: string
  name: string
  description: string
  position: number
}

export type MemberProgramWeekDetail = {
  weekId: string
  title: string
  description: string
  position: number
  workouts: MemberProgramWorkoutSummary[]
}