import { ApiError } from "../../../services/apiClient";
import type {
  AdminProgramWeek,
  AdminProgramWeekWorkout,
} from "../types/adminProgramStructure";
import type { AdminWorkout } from "../types/adminWorkout";
import { structureError } from "../components/programStructureStyles";

export function weekPositionMessage(
  position: number,
  weeks: AdminProgramWeek[],
  excludeId?: string,
) {
  const occupant = weeks.find(
    (week) => week.position === position && week.id !== excludeId,
  );
  return occupant
    ? `Position ${position} is already used by "${occupant.title}".`
    : `Position ${position} is already used by Week ${position}.`;
}

export function workoutPositionMessage(
  position: number,
  weekPosition: number,
  assignments: AdminProgramWeekWorkout[],
  workouts: AdminWorkout[],
  excludeId?: string,
) {
  const occupant = assignments.find(
    (item) => item.position === position && item.id !== excludeId,
  );
  const workout = workouts.find((item) => item.id === occupant?.workoutId);
  return workout
    ? `Position ${position} is already used by "${workout.name}". Choose another position or move that workout first.`
    : `Position ${position} is already occupied in Week ${weekPosition}.`;
}

export function positionMutationError(error: unknown, conflictMessage: string) {
  if (error instanceof ApiError && error.status === 409) {
    const title =
      typeof error.payload === "object" &&
      error.payload !== null &&
      "title" in error.payload
        ? String(error.payload.title)
        : "";
    if (
      /position conflict/i.test(title) ||
      /position\s+\d+\s+(?:is\s+)?already\s+(?:used|occupied)/i.test(
        error.message,
      )
    )
      return conflictMessage;
  }
  return structureError(error);
}
