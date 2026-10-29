import { safeExternalUrl } from "../../../utils/safeExternalUrl";
import type { AdminProgramResource } from "../types/adminProgramResource";

export function resourcePositionMessage(
  position: number,
  resources: AdminProgramResource[],
  excludeId?: string,
) {
  const occupant = resources.find(
    (resource) =>
      resource.position === position && resource.id !== excludeId,
  );

  return (
    (occupant
      ? `Position ${position} is already used by "${occupant.title}".`
      : `Position ${position} is already occupied in this program.`) +
    " Choose another position or move that resource first."
  );
}

export function resourceLink(url: string | null): string | null {
  return safeExternalUrl(url ?? "");
}