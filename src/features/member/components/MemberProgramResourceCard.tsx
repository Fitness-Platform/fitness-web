import { ExternalLink } from "lucide-react";

import { safeExternalUrl } from "../../../utils/safeExternalUrl";
import type { MemberProgramResource } from "../types/memberProgramDetail";

type MemberProgramResourceCardProps = {
  resource: MemberProgramResource;
};

function MemberProgramResourceCard({
  resource,
}: MemberProgramResourceCardProps) {
  const href = safeExternalUrl(resource.url);

  const content = (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Resource
        </p>

        <h3 className="mt-1.5 text-base font-semibold leading-6 tracking-tight text-foreground transition group-hover:text-primary-dark">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            {resource.description}
          </p>
        )}
      </div>

      {href && (
        <ExternalLink
          className="mt-6 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary-dark"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      )}
    </div>
  );

  if (!href) {
    return (
      <div className="block border-t border-border py-4 sm:py-5">
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-t border-border py-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 sm:py-5"
      aria-label={`${resource.title} (opens in a new tab)`}
    >
      {content}
    </a>
  );
}

export default MemberProgramResourceCard;