import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../services/apiClient";
import { authSessionQueryKey } from "../../auth/hooks/useAuthSession";

export default function MemberRequestError({
  error,
  subject,
  onRetry,
  message,
}: {
  error: unknown;
  subject: string;
  onRetry?: () => unknown;
  message?: string;
}) {
  const client = useQueryClient();
  const status = error instanceof ApiError ? error.status : null;
  useEffect(() => {
    if (status === 401) {
      client.setQueryData(authSessionQueryKey, null);
      client.removeQueries({ queryKey: ["member"] });
    }
  }, [status, client]);
  const missing = status === 404 || (status === 400 && !message);
  return (
    <div role="alert" className="border border-border bg-background p-5 sm:p-6">
      <p className="text-sm text-foreground">
        {status === 401
          ? "Your session has expired. Please sign in again."
          : status === 403
            ? "This content is not currently available to your account."
            : missing
              ? `This ${subject === "programs" ? "content" : subject} could not be found.`
              : (message ??
                `We couldn't load ${subject === "programs" ? "your programs" : `this ${subject}`}.`)}
      </p>
      {onRetry && !missing && status !== 401 && status !== 403 && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 min-h-11 text-sm text-primary-dark underline underline-offset-4"
        >
          Try again
        </button>
      )}
    </div>
  );
}
