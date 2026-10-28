import { programIdPattern } from "./programDestination.ts";

export function readSalesProgramId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return programIdPattern.test(id) ? id.toLowerCase() : null;
}

export function matchesSalesProgramId(
  programId: unknown,
  configuredId: unknown,
): boolean {
  const configured = readSalesProgramId(configuredId);
  return configured !== null && readSalesProgramId(programId) === configured;
}
