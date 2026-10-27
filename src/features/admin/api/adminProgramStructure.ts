import { apiRequest } from "../../../services/apiClient";
import { getCsrfToken } from "../../auth/api/getCsrfToken";
import type {
  AdminProgramWeek,
  AdminProgramWeekWorkout,
  ProgramWeekRequest,
} from "../types/adminProgramStructure";

const weeksPath = (programId: string) =>
  `/api/admin/programs/${programId}/weeks`;

export function getAdminProgramWeeks(programId: string) {
  return apiRequest<AdminProgramWeek[]>(weeksPath(programId));
}

export function getAdminProgramWeekWorkouts(programId: string, weekId: string) {
  return apiRequest<AdminProgramWeekWorkout[]>(
    `${weeksPath(programId)}/${weekId}/workouts`,
  );
}

export type ProgramStructureChange =
  | { action: "createWeek"; request: ProgramWeekRequest }
  | { action: "updateWeek"; weekId: string; request: ProgramWeekRequest }
  | { action: "deleteWeek"; weekId: string }
  | {
      action: "assignWorkout";
      weekId: string;
      request: { workoutId: string; position: number };
    }
  | {
      action: "updateWorkout";
      weekId: string;
      assignmentId: string;
      request: { position: number };
    }
  | { action: "removeWorkout"; weekId: string; assignmentId: string };

export async function changeAdminProgramStructure(
  programId: string,
  change: ProgramStructureChange,
): Promise<void> {
  let path = weeksPath(programId);
  if ("weekId" in change) path += `/${change.weekId}`;
  if (
    change.action === "assignWorkout" ||
    change.action === "updateWorkout" ||
    change.action === "removeWorkout"
  ) {
    path += "/workouts";
  }
  if ("assignmentId" in change) path += `/${change.assignmentId}`;
  const method =
    change.action === "deleteWeek" || change.action === "removeWorkout"
      ? "DELETE"
      : change.action === "createWeek" || change.action === "assignWorkout"
        ? "POST"
        : "PUT";
  const csrf = await getCsrfToken();
  await apiRequest<unknown>(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    ...("request" in change ? { body: JSON.stringify(change.request) } : {}),
  });
}
