export type MemberWorkoutSet = {
  id: string
  workoutExerciseId: string
  setNumber: number
  reps: number
  weightLb: number
  completedAt: string
}

export type MemberWorkoutExercise = {
  workoutExerciseId: string
  exerciseId: string
  name: string
  instructions: string
  equipment: string
  videoUrl: string
  sets: number
  reps: string
  suggestedWeightLb: number | null
  currentWeightLb: number | null
  restSeconds: number | null
  notes: string
  position: number
  completedSets: MemberWorkoutSet[]
  previousSets: MemberWorkoutPreviousSet[]
}

export type MemberProgramWorkoutDetail = {
  programWeekWorkoutId: string
  workoutId: string
  name: string
  description: string
  position: number
  startedAt: string | null
  completedAt: string | null
  exercises: MemberWorkoutExercise[]
}

export type MemberWorkoutPreviousSet = {
  setNumber: number
  reps: number
  weightLb: number
}