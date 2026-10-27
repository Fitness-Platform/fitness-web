export type AdminProgramWeek = {
  id: string;
  programId: string;
  title: string;
  description: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminProgramWeekWorkout = {
  id: string;
  programWeekId: string;
  workoutId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type ProgramWeekRequest = {
  title: string;
  description: string | null;
  position: number;
};
