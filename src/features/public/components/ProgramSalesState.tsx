import { Link } from "react-router-dom";
import { container, eyebrow, primaryCta } from "./styles";

export default function ProgramSalesState({
  state,
  retry,
}: {
  state: "loading" | "unavailable" | "error";
  retry?: () => void;
}) {
  return (
    <section
      aria-labelledby="program-state-title"
      aria-busy={state === "loading"}
      className={`${container} min-h-[38rem] py-16 md:py-24`}
    >
      <p className={eyebrow}>Daniela Brito · Programs</p>
      <h1
        id="program-state-title"
        className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight"
      >
        {state === "loading"
          ? "Your stronger way forward."
          : state === "unavailable"
            ? "Program not available"
            : "We could not load this program."}
      </h1>
      <p
        role={state === "error" ? "alert" : "status"}
        className="mt-5 max-w-lg leading-relaxed text-muted-foreground"
      >
        {state === "loading"
          ? "Getting your program ready…"
          : state === "unavailable"
            ? "This program is currently unavailable."
            : "Please try again in a moment."}
      </p>
      {state !== "loading" && (
        <div className="mt-7 flex flex-wrap gap-4">
          {state === "error" && (
            <button type="button" onClick={retry} className={primaryCta}>
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                Try again
              </span>
            </button>
          )}
          <Link
            to="/#programs"
            className="inline-flex min-h-12 items-center underline underline-offset-4"
          >
            Back to programs
          </Link>
        </div>
      )}
    </section>
  );
}
