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
