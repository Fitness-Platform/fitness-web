import { apiRequest } from "../../../services/apiClient";

export type PublicProgram = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  currency: string;
};

export function getPublicProgram(programId: string): Promise<PublicProgram> {
  return apiRequest<PublicProgram>(
    `/api/programs/${encodeURIComponent(programId)}`,
  );
}

export function getPublicPrograms(): Promise<PublicProgram[]> {
  return apiRequest<PublicProgram[]>("/api/programs");
}
