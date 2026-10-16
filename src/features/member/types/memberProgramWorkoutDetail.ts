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
}

export type MemberProgramWorkoutDetail = {
  programWeekWorkoutId: string
  workoutId: string
  name: string
  description: string
  position: number
  exercises: MemberWorkoutExercise[]
}