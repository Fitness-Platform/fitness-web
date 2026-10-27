import type { AdminProgramResource } from "../types/adminProgramResource";

export function resourcePositionMessage(
  position: number,
  resources: AdminProgramResource[],
  excludeId?: string,
) {
  const occupant = resources.find(
    (resource) => resource.position === position && resource.id !== excludeId,
  );
  return (
    (occupant
      ? `Position ${position} is already used by "${occupant.title}".`
      : `Position ${position} is already occupied in this program.`) +
    " Choose another position or move that resource first."
  );
}

// Rendering a link is separate from backend validation. Other values remain visible as text.
export function resourceLink(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}
