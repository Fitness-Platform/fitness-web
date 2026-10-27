import { ApiError } from "../../../services/apiClient";

export function purchaseAmount(amountCents: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amountCents / 100);
  } catch {
    return `${new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amountCents / 100)} ${currency}`;
  }
}

export function purchaseDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function purchaseDetailError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 404)
      return "This purchase could not be found. Refresh the purchase list.";
    if (error.status === 401)
      return "Your session has expired. Please sign in again.";
    if (error.status === 403)
      return "You do not have permission to view this purchase.";
  }
  return "Unable to load purchase details. Please try again.";
}
