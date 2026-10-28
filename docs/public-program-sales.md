# F-PUBLIC.0 — integration boundary

The frontend route is `/programs/:programId`. Supply a real program UUID; none is hard-coded. The page uses approved six-week-program marketing copy and existing photographs. It does not query Admin or private Member content to populate a public sales page.

## Verified backend contracts

- `GET /api/auth/me`: cookie session; 401 means signed out.
- `GET /api/auth/csrf`: existing XSRF cookie/header pattern.
- `POST /api/programs/{programId}/checkout`: authenticated and CSRF-protected; no body. Returns 201 `{ purchaseId, checkoutUrl }`. The server selects the program, price, currency, creates the pending purchase and Stripe session.
- Stripe return URLs default to `/checkout/success` and `/checkout/cancel` in backend configuration. The new neutral return pages do not mark payment complete, grant access, or infer a purchase from URL state. These paths must match deployment Stripe configuration.

## Public product data

`GET /api/programs` and `GET /api/programs/{programId}` are anonymous published-only reads returning `{ id, name, description, priceCents, currency }`. The sales page uses the detail response for product identity, the hero description and pricing and formats cents with `Intl.NumberFormat`. No price or ID is hard-coded. Null/invalid/non-positive pricing disables enrollment rather than inventing a price. Loading, 404/unavailable and retryable public error states do not expose raw backend errors.

Home requests the public list once through TanStack Query. When exactly one program is returned, its UUID supplies the Hero, Featured Program and final program-exploration links; the price-bearing CTA labels use its API price. Header PROGRAM remains the Home section anchor and JOIN NOW remains account registration. With zero/multiple results or a list failure, no product is selected: exploration links fall back to the existing Home program section, and the direct enrollment link is unavailable. Selecting among multiple published products requires a product-selection/featured-program rule; this task does not create one or add a catalog. Approved static editorial copy and photography remain unchanged.

## Authentication and checkout

Enrollment rechecks the cookie session. Signed-out visitors go to Login with an allowlisted `/programs/{UUID}` `returnTo` query; switching between Login/Register and successful registration preserves it. Login returns to the sales page, where the user explicitly presses Enroll again. Other authentication destinations retain existing defaults. External/other return destinations are ignored.

Checkout is explicit, not automatic after login, and never automatically retried. Both enrollment buttons share an in-flight lock. 401 returns to Login, 403/404/409/provider failures show generic contextual messages without exposing backend identifiers. Only an HTTPS `checkout.stripe.com` destination is accepted. No payment credentials or auth tokens are stored in browser storage.

Browser validation covers persisted local public program data when a local backend is available, plus mocked authentication/error scenarios and Stripe navigation, not real payments. Backend/webhook confirmation remains authoritative.
