export type MediaPurpose = "EXERCISE_VIDEO" | "PROGRAM_RESOURCE";

export type UploadedMedia = {
  id: string;
  sourceType: "UPLOADED";
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
};

export type MediaUploadRequest = {
  purpose: MediaPurpose;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
};

export type MediaUploadAuthorization = {
  uploadId: string;
  uploadUrl: string;
  requiredHeaders: Record<string, string>;
  expiresAt: string;
};

export type MediaUploadPhase = "authorizing" | "uploading" | "verifying";
