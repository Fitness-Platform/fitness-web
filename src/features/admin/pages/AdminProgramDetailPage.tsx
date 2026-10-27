import AdminProgramStructure from '../components/AdminProgramStructure';
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAdminProgramQuery } from "../hooks/useAdminProgramQuery";
import AdminProgramDetailsCard from "../components/AdminProgramDetailsCard";
import AdminProgramPricingCard from "../components/AdminProgramPricingCard";
import AdminProgramStatusCard from "../components/AdminProgramStatusCard";
import AdminProgramDangerZone from "../components/AdminProgramDangerZone";

function AdminProgramDetailPage() {
  const { programId = "" } = useParams();

  const {
    data: program,
    isPending,
    isError,
    refetch,
  } = useAdminProgramQuery(programId);

  if (isPending) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading program...
      </p>
    );
  }

  if (isError || !program) {
    return (
      <section className="border border-border p-5">
        <p className="text-sm font-medium text-foreground">
          Unable to load program
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 border border-primary-dark px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-primary-dark"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <section>
        <Link
          to="/admin/programs"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
          Programs
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[32px] font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
              {program.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {program.description ?? "No description"}
            </p>
          </div>

          <span
            className={
              program.status === "PUBLISHED"
                ? "w-fit bg-primary/10 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-primary-dark"
                : "w-fit bg-[#F3EEE1] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-[#776842]"
            }
          >
            {program.status}
          </span>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <AdminProgramDetailsCard program={program} />

        <div className="space-y-4">
          <AdminProgramPricingCard program={program} />

          <AdminProgramStatusCard program={program} />
        </div>
      </section>

      <AdminProgramStructure key={programId} programId={programId} />

      <AdminProgramDangerZone program={program} />
    </div>
  );
}

export default AdminProgramDetailPage;
