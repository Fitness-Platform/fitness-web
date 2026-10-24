export type AdminWorkoutExercise = {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: number;
  reps: string;
  suggestedWeightLb: number | null;
  restSeconds: number | null;
  notes: string | null;
  position: number;
};