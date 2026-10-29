import { ApiError } from "../../../services/apiClient";

export function memberQueryRetry(failures: number, error: Error) {
  if (error instanceof ApiError && [400, 401, 403, 404].includes(error.status))
    return false;
  return failures < 1;
}
