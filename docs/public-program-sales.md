# F-PUBLIC.0 — integration boundary

The frontend route is `/programs/:programId`. Supply a real program UUID; none is hard-coded. The page uses approved six-week-program marketing copy and existing photographs. It does not query Admin or private Member content to populate a public sales page.

## Verified backend contracts

- `GET /api/auth/me`: cookie session; 401 means signed out.
- `GET /api/auth/csrf`: existing XSRF cookie/header pattern.
- `POST /api/programs/{programId}/checkout`: authenticated and CSRF-protected; no body. Returns 201 `{ purchaseId, checkoutUrl }`. The server selects the program, price, currency, creates the pending purchase and Stripe session.
- Stripe return URLs default to `/checkout/success` and `/checkout/cancel` in backend configuration. The new neutral return pages do not mark payment complete, grant access, or infer a purchase from URL state. These paths must match deployment Stripe configuration.

## Missing public product data

The inspected backend provides no public program GET/list endpoint. `/api/admin/programs` is Admin-only; `/api/me/programs` requires existing program access and does not expose current pricing. The checkout response also has no price/currency. Therefore this page cannot safely display an API-derived numeric price, verify that a supplied UUID identifies this particular six-week product, or discover its ID from Home. It displays “Current price shown at secure checkout” and leaves Home unchanged. The caller must supply the intended program link; Stripe shows the actual backend product/price before payment. Full product discovery, identity verification and on-page cents/currency pricing need a backend public program-read contract. No such endpoint is guessed or called.

## Authentication and checkout

Enrollment rechecks the cookie session. Signed-out visitors go to Login with an allowlisted `/programs/{UUID}` `returnTo` query; switching between Login/Register and successful registration preserves it. Login returns to the sales page, where the user explicitly presses Enroll again. Other authentication destinations retain existing defaults. External/other return destinations are ignored.

Checkout is explicit, not automatic after login, and never automatically retried. Both enrollment buttons share an in-flight lock. 401 returns to Login, 403/404/409/provider failures show generic contextual messages without exposing backend identifiers. Only an HTTPS `checkout.stripe.com` destination is accepted. No payment credentials or auth tokens are stored in browser storage.

Local browser validation uses mocked backend responses and Stripe navigation, not real payments. Backend/webhook confirmation remains authoritative.
