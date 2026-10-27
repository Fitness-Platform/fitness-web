export type AdminProgramResource = {
  id: string;
  programId: string;
  title: string;
  description: string | null;
  url: string;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type ProgramResourceRequest = Pick<
  AdminProgramResource,
  "title" | "description" | "url" | "position"
>;
