import type { UploadedMedia } from "./adminMedia";

export type AdminExercise = {
  id: string;
  name: string;
  instructions: string | null;
  equipment: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  uploadedMedia?: UploadedMedia | null;
};