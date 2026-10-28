import { Link, useParams } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import ProgramSalesHero from "../components/ProgramSalesHero";
import ProgramSalesContent from "../components/ProgramSalesContent";
import ProgramEnrollmentButton from "../components/ProgramEnrollmentButton";
import { container } from "../components/styles";
import { useProgramEnrollment } from "../hooks/useProgramEnrollment";
import { programIdPattern } from "../utils/programDestination";

function SalesContent({ programId }: { programId: string }) {
  const enrollment = useProgramEnrollment(programId);
  const buttonProps = {
    onEnroll: enrollment.enroll,
    busy: enrollment.busy,
    checking: enrollment.session.isPending,
  };
  return (
    <>
      <ProgramSalesHero
        {...buttonProps}
        authenticated={enrollment.session.isAuthenticated}
        message={enrollment.message}
      />
      <ProgramSalesContent />
      <section
        aria-labelledby="enroll-title"
        className="bg-[#202424] text-[#F7F5F0]"
      >
        <div
          className={`${container} grid items-center gap-7 py-10 md:grid-cols-[1.2fr_0.8fr] md:py-14`}
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#B6C7BC]">
              Your stronger way forward
            </p>
            <h2
              id="enroll-title"
              className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] lg:text-4xl"
            >
              The 6-Week Dumbbell Strength Program for Women 40+
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">
              Dumbbell workouts. A structured plan. At home or in the gym.
            </p>
          </div>
          <div className="md:border-l md:border-white/20 md:pl-8">
            <p className="mb-4 text-sm">
              Current price shown at secure checkout.
            </p>
            <ProgramEnrollmentButton {...buttonProps} />
            <p className="mt-3 text-xs leading-relaxed text-white/75">
              {enrollment.session.isAuthenticated
                ? "Review your order on Stripe before paying."
                : "You'll sign in or create an account before secure checkout."}
            </p>
            {enrollment.message && (
              <p role="alert" className="mt-4 text-sm text-[#FFD5D5]">
                {enrollment.message}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function ProgramSalesPage() {
  const { programId = "" } = useParams();
  return (
    <div className="bg-background text-foreground">
      <a
        href="#sales-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        Skip to content
      </a>
      <PublicHeader
        homeAnchors={false}
        authReturnTo={
          programIdPattern.test(programId) ? `/programs/${programId}` : null
        }
      />
      <main id="sales-content">
        {programIdPattern.test(programId) ? (
          <SalesContent programId={programId} />
        ) : (
          <div className={`${container} py-20`}>
            <h1 className="text-3xl font-semibold">Program not found</h1>
            <p className="mt-4 text-muted-foreground">
              Please check your program link.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-11 items-center underline"
            >
              Back to Home
            </Link>
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
