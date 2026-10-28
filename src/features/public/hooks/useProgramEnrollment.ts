import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../../services/apiClient";
import {
  authSessionQueryKey,
  useAuthSession,
} from "../../auth/hooks/useAuthSession";
import {
  createProgramCheckout,
  stripeCheckoutUrl,
} from "../api/createProgramCheckout";
import { authDestination } from "../utils/programDestination";

export function useProgramEnrollment(programId: string) {
  const session = useAuthSession();
  const navigate = useNavigate();
  const client = useQueryClient();
  const inFlight = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const checkout = useMutation({
    mutationFn: createProgramCheckout,
    retry: false,
  });
  const destination = `/programs/${programId}`;

  async function enroll() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage(null);
    let leaving = false;
    try {
      const current = await session.refetch();
      if (current.isError) {
        setMessage("We could not check your session. Please try again.");
        return;
      }
      if (!current.data) {
        navigate(authDestination("/login", destination));
        return;
      }
      const result = await checkout.mutateAsync(programId);
      window.location.assign(stripeCheckoutUrl(result.checkoutUrl));
      leaving = true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        client.setQueryData(authSessionQueryKey, null);
        navigate(authDestination("/login", destination));
      } else if (
        error instanceof ApiError &&
        (error.status === 404 || error.status === 409)
      ) {
        setMessage(
          "This program is not available for enrollment right now. Please try again later.",
        );
      } else if (error instanceof ApiError && error.status === 403) {
        setMessage(
          "We could not authorize checkout. Refresh this page and try again.",
        );
      } else {
        setMessage("We could not open secure checkout. Please try again.");
      }
    } finally {
      if (!leaving) {
        inFlight.current = false;
        setBusy(false);
      }
    }
  }

  return { enroll, busy, message, session };
}
