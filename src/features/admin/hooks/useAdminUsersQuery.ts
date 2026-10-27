import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "../api/adminUsers";

export function useAdminUsersQuery(email = "") {
  return useQuery({
    queryKey: ["admin", "users", email.trim()],
    queryFn: () => getAdminUsers(email),
    staleTime: 60_000,
  });
}
