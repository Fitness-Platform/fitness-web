export type AdminUser = {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};
