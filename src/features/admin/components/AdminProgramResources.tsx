import { ExternalLink, Plus } from "lucide-react";
import { useState } from "react";
import { useAdminProgramResourcesQuery } from "../hooks/useAdminProgramResources";
import type { AdminProgramResource } from "../types/adminProgramResource";
import { resourceLink } from "../utils/programResourceMessages";
import AdminProgramResourceDrawer from "./AdminProgramResourceDrawer";
import AdminDeleteProgramResourceDialog from "./AdminDeleteProgramResourceDialog";
import { structureButton } from "./programStructureStyles";

type Action =
  | { kind: "edit"; resource?: AdminProgramResource }
  | { kind: "delete"; resource: AdminProgramResource };

export default function AdminProgramResources({
  programId,
}: {
  programId: string;
}) {
  const query = useAdminProgramResourcesQuery(programId);
  const [action, setAction] = useState<Action | null>(null);
  const resources = query.data ?? [];
  const nextPosition =
    Math.max(0, ...resources.map((resource) => resource.position)) + 1;
  const close = () => setAction(null);
  return (
    <section
      aria-labelledby="program-resources-heading"
      className="border border-border"
    >
      <header className="flex flex-wrap items-end justify-between gap-5 px-5 py-7 sm:px-7">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-dark">
            Program Resources
          </p>
          <h2
            id="program-resources-heading"
            className="mt-3 text-2xl font-semibold tracking-tight"
          >
            Resources
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Supporting materials available for this program.
          </p>
        </div>
        <button
          type="button"
          className={structureButton}
          disabled={!query.isSuccess || query.isFetching}
          onClick={() => setAction({ kind: "edit" })}
        >
          <Plus size={14} aria-hidden="true" /> Add Resource
        </button>
      </header>
      {query.isPending ? (
        <p
          role="status"
          className="border-t border-border px-5 py-7 text-sm text-muted-foreground sm:px-7"
        >
          Loading resources...
        </p>
      ) : query.isError ? (
        <div role="alert" className="border-t border-border px-5 py-7 sm:px-7">
          <p className="text-sm text-red-700">
            Unable to load program resources.
          </p>
          <button
            type="button"
            className={structureButton + " mt-3"}
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </div>
      ) : resources.length ? (
        <ol className="divide-y divide-border border-t border-border">
          {resources.map((resource) => {
            const href = resourceLink(resource.url);
            return (
              <li
                key={resource.id}
                className="flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-start sm:gap-6 sm:px-7"
              >
                <span
                  className="pt-1 text-xs text-muted-foreground"
                  aria-label={`Position ${resource.position}`}
                >
                  {String(resource.position).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 break-words">
                  <h3 className="text-base font-medium">{resource.title}</h3>
                  {resource.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {resource.description}
                    </p>
                  )}
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex max-w-full items-start gap-2 text-sm text-primary-dark underline underline-offset-4"
                    >
                      <span className="min-w-0 break-all">{resource.url}</span>
                      <ExternalLink
                        size={14}
                        className="mt-1 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <p className="mt-2 break-all text-sm text-muted-foreground">
                      {resource.url}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="min-h-11 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-dark"
                    onClick={() => setAction({ kind: "edit", resource })}
                    aria-label={`Edit resource ${resource.title}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="min-h-11 text-[10px] font-medium uppercase tracking-[0.16em] text-red-700"
                    onClick={() => setAction({ kind: "delete", resource })}
                    aria-label={`Delete resource ${resource.title}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="border-t border-border px-5 py-7 text-sm leading-6 text-muted-foreground sm:px-7">
          <p>No resources yet.</p>
          <p>Add supporting links or materials for this program.</p>
        </div>
      )}
      {action?.kind === "edit" && (
        <AdminProgramResourceDrawer
          programId={programId}
          resource={action.resource}
          nextPosition={nextPosition}
          onClose={close}
        />
      )}
      {action?.kind === "delete" && (
        <AdminDeleteProgramResourceDialog
          programId={programId}
          resource={action.resource}
          onClose={close}
        />
      )}
    </section>
  );
}
