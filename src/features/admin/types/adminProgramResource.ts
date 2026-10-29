import type { UploadedMedia } from "./adminMedia";

export type AdminProgramResource = {
  id: string;
  programId: string;
  title: string;
  description: string | null;
  url: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  uploadedMedia?: UploadedMedia | null;
};

export type ProgramResourceRequest = Pick<
  AdminProgramResource,
  "title" | "description" | "url" | "position"
> & { mediaId?: string | null };
