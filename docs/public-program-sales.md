# F-PUBLIC.0 — integration boundary

The frontend route is `/programs/:programId`. Use the configured Sales Program UUID; none is hard-coded. The page uses approved six-week-program marketing copy and existing photographs. It does not query Admin or private Member content to populate a public sales page.

## Verified backend contracts

- `GET /api/auth/me`: cookie session; 401 means signed out.
- `GET /api/auth/csrf`: existing XSRF cookie/header pattern.
- `POST /api/programs/{programId}/checkout`: authenticated and CSRF-protected; no body. Returns 201 `{ purchaseId, checkoutUrl }`. The server selects the program, price, currency, creates the pending purchase and Stripe session.
- Stripe return URLs default to `/checkout/success` and `/checkout/cancel` in backend configuration. The new neutral return pages do not mark payment complete, grant access, or infer a purchase from URL state. These paths must match deployment Stripe configuration.

## Public product data

`GET /api/programs` and `GET /api/programs/{programId}` are anonymous published-only reads returning `{ id, name, description, priceCents, currency }`. The sales page uses the detail response for product identity, the hero description and pricing and formats cents with `Intl.NumberFormat`. No price or ID is hard-coded. Null/invalid/non-positive pricing disables enrollment rather than inventing a price. Loading, 404/unavailable and retryable public error states do not expose raw backend errors.

## Sales product configuration

Set `VITE_SALES_PROGRAM_ID` in your ignored local `.env` and in the deployment build environment to the backend UUID for Daniela's 6-week product. `.env.example` intentionally leaves it blank. Vite embeds this public product identifier at build time; restart the dev server after changing it and rebuild for deployment. It is not a secret or an authentication token.

A centralized configuration validates the UUID. The sales route accepts only that identity (UUID letter casing is equivalent); other UUIDs are unavailable and are never redirected/substituted. The returned API identity is checked as well. Missing, empty, or malformed configuration fails closed without crashing or displaying configuration details.

Home fetches only the configured program through the detail endpoint and never infers a featured product from list cardinality, order, name, or another published product. If it cannot load the configured program, direct enrollment is unavailable and exploration links retain the existing Home section fallback. Header PROGRAM remains the Home section anchor and JOIN NOW remains account registration. The public list API remains available for future callers, but this page does not use it to choose a product.

Both sales enrollment buttons include the API-derived formatted price. No price or product UUID is hard-coded in application source. Existing editorial copy, photography, authentication, CSRF and checkout behavior are unchanged.

## Focused tests

Run `npm test` using Node 24 or newer. Node's native test runner/type stripping covers program return destinations, Stripe URL safety, price formatting/CTA labels, and configuration/identity matching without additional test dependencies. Browser checks cover Home's configured-only selection, missing/unavailable configuration and programs, route rejection, enrollment, and responsive layouts.

## Authentication and checkout

Enrollment rechecks the cookie session. Signed-out visitors go to Login with an allowlisted `/programs/{UUID}` `returnTo` query; switching between Login/Register and successful registration preserves it. Login returns to the sales page, where the user explicitly presses Enroll again. Other authentication destinations retain existing defaults. External/other return destinations are ignored.

Checkout is explicit, not automatic after login, and never automatically retried. Both enrollment buttons share an in-flight lock. 401 returns to Login, 403/404/409/provider failures show generic contextual messages without exposing backend identifiers. Only an HTTPS `checkout.stripe.com` destination is accepted. No payment credentials or auth tokens are stored in browser storage.

Browser validation covers persisted local public program data when a local backend is available, plus mocked authentication/error scenarios and Stripe navigation, not real payments. Backend/webhook confirmation remains authoritative.
