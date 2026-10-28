import test from "node:test";
import assert from "node:assert/strict";
import {
  programReturnTo,
  authDestination,
} from "../src/features/public/utils/programDestination.ts";
import { stripeCheckoutUrl } from "../src/features/public/utils/stripeCheckoutUrl.ts";
import {
  formatProgramPrice,
  programEnrollmentLabel,
} from "../src/features/public/utils/programPrice.ts";
import {
  readSalesProgramId,
  matchesSalesProgramId,
} from "../src/features/public/utils/salesProgramIdentity.ts";

const sales = "11111111-2222-4333-8444-555555555555";
const other = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const destination = `/programs/${sales}`;

test("authentication preserves a valid program destination through both auth pages", () => {
  const search = `?${new URLSearchParams({ returnTo: destination })}`;
  assert.equal(programReturnTo(search), destination);
  for (const path of ["/login", "/register"]) {
    assert.equal(
      programReturnTo(
        new URL(authDestination(path, destination), "https://site.test").search,
      ),
      destination,
    );
    assert.equal(authDestination(path, null), path);
  }
});

test("return destinations reject external, malformed, nested and extra-path targets", () => {
  for (const returnTo of [
    "https://evil.test",
    "//evil.test",
    "/admin",
    "/programs/nope",
    `${destination}/checkout`,
    `${destination}?next=evil`,
    `${destination}#pay`,
    `/programs/${sales}/../admin`,
    "/programs/%2f%2fevil.test",
  ]) {
    assert.equal(
      programReturnTo(`?${new URLSearchParams({ returnTo })}`),
      null,
      returnTo,
    );
  }
  assert.equal(programReturnTo(""), null);
  assert.equal(programReturnTo("?returnTo="), null);
});

test("Stripe accepts the server checkout URL without constructing a session URL", () => {
  const url =
    "https://checkout.stripe.com/c/pay/cs_test_value?prefilled_email=member%40example.com#step";
  assert.equal(stripeCheckoutUrl(url), url);
});

test("Stripe rejects non-HTTPS URLs, lookalike hosts, credentials and nonstandard ports", () => {
  for (const url of [
    "http://checkout.stripe.com/pay",
    "https://checkout.stripe.com.evil.test/pay",
    "https://evil.test/checkout.stripe.com",
    "https://sub.checkout.stripe.com/pay",
    "https://user:password@checkout.stripe.com/pay",
    "https://checkout.stripe.com:444/pay",
    "javascript:alert(1)",
    "//checkout.stripe.com/pay",
    "not a URL",
  ]) {
    assert.throws(() => stripeCheckoutUrl(url), undefined, url);
  }
});

test("prices use cents and the API currency, including explicit cents for whole amounts", () => {
  for (const [priceCents, currency, expected] of [
    [4999, "USD", "$49.99"],
    [8900, "USD", "$89.00"],
    [1, "USD", "$0.01"],
    [12345, "EUR", "€123.45"],
    [7654, "GBP", "£76.54"],
  ]) {
    assert.equal(formatProgramPrice({ priceCents, currency }), expected);
  }
});

test("missing, non-positive, fractional and unsafe pricing fails closed", () => {
  for (const priceCents of [
    null,
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.equal(formatProgramPrice({ priceCents, currency: "USD" }), null);
  }
  for (const currency of ["", "US", "USDD", "12$"]) {
    assert.equal(formatProgramPrice({ priceCents: 4999, currency }), null);
  }
});

test("enrollment CTA uses the actual formatted backend price", () => {
  for (const [priceCents, currency, expected] of [
    [4999, "USD", "Enroll now — $49.99"],
    [8900, "USD", "Enroll now — $89.00"],
    [12345, "EUR", "Enroll now — €123.45"],
  ]) {
    assert.equal(
      programEnrollmentLabel(formatProgramPrice({ priceCents, currency })),
      expected,
    );
  }
  assert.equal(programEnrollmentLabel(null), "Enrollment unavailable");
});

test("configured product identity accepts the same UUID only", () => {
  assert.equal(readSalesProgramId(` ${sales} `), sales);
  assert.equal(matchesSalesProgramId(sales, sales), true);
  assert.equal(matchesSalesProgramId(other, sales), false);
  assert.equal(matchesSalesProgramId(other.toUpperCase(), other), true);
});

test("missing or malformed sales configuration cannot select a product", () => {
  for (const value of [
    undefined,
    null,
    "",
    "  ",
    "invalid",
    `/programs/${sales}`,
    `${sales}/extra`,
  ]) {
    assert.equal(readSalesProgramId(value), null);
    assert.equal(matchesSalesProgramId(sales, value), false);
    assert.equal(matchesSalesProgramId(other, value), false);
  }
  assert.equal(matchesSalesProgramId(null, sales), false);
});
