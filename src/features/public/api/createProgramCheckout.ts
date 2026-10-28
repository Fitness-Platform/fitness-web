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

export { stripeCheckoutUrl } from "../utils/stripeCheckoutUrl";
