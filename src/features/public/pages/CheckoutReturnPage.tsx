import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { container, primaryCta } from "../components/styles";

export default function CheckoutReturnPage({
  outcome,
}: {
  outcome: "success" | "cancel";
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <PublicHeader homeAnchors={false} />
      <main className={`${container} flex-1 py-16 md:py-24`}>
        <p className="text-xs uppercase tracking-widest text-primary-dark">
          Program enrollment
        </p>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight">
          {outcome === "success"
            ? "Your checkout has returned."
            : "You left checkout."}
        </h1>
        <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
          {outcome === "success"
            ? "Payment confirmation can take a moment. Your program will appear in your member area once payment and access are confirmed."
            : "You can return to your program link whenever you are ready. If you already completed a payment, check your member area before trying again."}
        </p>
        <div className="mt-7 flex flex-wrap gap-4">
          <Link to="/app/programs" className={primaryCta}>
            My programs
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center px-4 text-sm underline underline-offset-4"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
