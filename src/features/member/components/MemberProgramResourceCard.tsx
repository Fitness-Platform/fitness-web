import { ExternalLink } from 'lucide-react'

import type { MemberProgramResource } from '../types/memberProgramDetail'

type MemberProgramResourceCardProps = {
  resource: MemberProgramResource
}

function MemberProgramResourceCard({
  resource,
}: MemberProgramResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="block border border-border p-5 transition hover:border-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Resource
          </p>

          <h3 className="mt-2 text-base font-medium text-foreground">
            {resource.title}
          </h3>
        </div>

        <ExternalLink
          className="h-4 w-4 shrink-0 text-muted-foreground"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      {resource.description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {resource.description}
        </p>
      )}
    </a>
  )
}

export default MemberProgramResourceCard