import { apiRequest } from "../../../services/apiClient";
import { getCsrfToken } from "../../auth/api/getCsrfToken";
import type {
  AdminProgramResource,
  ProgramResourceRequest,
} from "../types/adminProgramResource";

const resourcesPath = (programId: string) =>
  `/api/admin/programs/${programId}/resources`;

export function getAdminProgramResources(programId: string) {
  return apiRequest<AdminProgramResource[]>(resourcesPath(programId));
}

export type ProgramResourceChange =
  | { action: "create"; request: ProgramResourceRequest }
  | { action: "update"; resourceId: string; request: ProgramResourceRequest }
  | { action: "delete"; resourceId: string };

export async function changeAdminProgramResource(
  programId: string,
  change: ProgramResourceChange,
): Promise<void> {
  const csrf = await getCsrfToken();
  const path =
    resourcesPath(programId) +
    ("resourceId" in change ? `/${change.resourceId}` : "");
  await apiRequest<unknown>(path, {
    method:
      change.action === "create"
        ? "POST"
        : change.action === "update"
          ? "PUT"
          : "DELETE",
    headers: {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    ...("request" in change ? { body: JSON.stringify(change.request) } : {}),
  });
}
