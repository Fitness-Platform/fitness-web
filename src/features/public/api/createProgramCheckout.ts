import { apiRequest } from "../../../services/apiClient";
import { getCsrfToken } from "../../auth/api/getCsrfToken";

export type ProgramCheckout = { purchaseId: string; checkoutUrl: string };

export async function createProgramCheckout(
  programId: string,
): Promise<ProgramCheckout> {
  const csrf = await getCsrfToken();
  return apiRequest<ProgramCheckout>(
    `/api/programs/${encodeURIComponent(programId)}/checkout`,
    {
      method: "POST",
      headers: { [csrf.headerName]: csrf.token },
    },
  );
}

export function stripeCheckoutUrl(value: string): string {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "checkout.stripe.com" ||
    url.username ||
    url.password ||
    url.port
  ) {
    throw new Error("Unexpected checkout destination");
  }
  return url.href;
}
