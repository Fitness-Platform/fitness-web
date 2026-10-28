import { useParams } from "react-router-dom";
import { ApiError } from "../../../services/apiClient";
import type { PublicProgram } from "../api/getPublicProgram";
import { usePublicProgram } from "../hooks/usePublicProgram";
import { formatProgramPrice } from "../utils/programPrice";
import ProgramSalesState from "../components/ProgramSalesState";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import ProgramSalesHero from "../components/ProgramSalesHero";
import ProgramSalesContent from "../components/ProgramSalesContent";
import ProgramEnrollmentButton from "../components/ProgramEnrollmentButton";
import { container } from "../components/styles";
import { useProgramEnrollment } from "../hooks/useProgramEnrollment";
import { isConfiguredSalesProgram } from "../config/salesProgram";

function SalesContent({ program }: { program: PublicProgram }) {
  const price = formatProgramPrice(program);
  const enrollment = useProgramEnrollment(program.id);
  const buttonProps = {
    onEnroll: enrollment.enroll,
    price,
    unavailable: price === null,
    busy: enrollment.busy,
    checking: enrollment.session.isPending,
  };
  return (
    <>
      <ProgramSalesHero
        {...buttonProps}
        program={program}
        price={price}
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
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#B6C7BC]">
              Your stronger way forward
            </p>
            <h2
              id="enroll-title"
              className="mt-3 break-words text-3xl font-semibold leading-tight tracking-[-0.04em] lg:text-4xl"
            >
              {program.name}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">
              Dumbbell workouts. A structured plan. At home or in the gym.
            </p>
          </div>
          <div className="md:border-l md:border-white/20 md:pl-8">
            <p className="mb-4 text-3xl font-semibold tracking-tight">
              {price ?? "Enrollment unavailable"}
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
  const allowed = isConfiguredSalesProgram(programId);
  const query = usePublicProgram(allowed ? programId : "");
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
        authReturnTo={allowed ? `/programs/${programId}` : null}
      />
      <main id="sales-content">
        {!allowed ||
        (query.error instanceof ApiError && query.error.status === 404) ? (
          <ProgramSalesState state="unavailable" />
        ) : query.isPending ? (
          <ProgramSalesState state="loading" />
        ) : query.isError ? (
          <ProgramSalesState state="error" retry={() => void query.refetch()} />
        ) : !isConfiguredSalesProgram(query.data.id) ? (
          <ProgramSalesState state="unavailable" />
        ) : (
          <SalesContent key={query.data.id} program={query.data} />
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
