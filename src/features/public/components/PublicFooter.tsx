import { container } from './styles'

export default function PublicFooter() {
  return (
    <footer className={container}>
      <div className="flex flex-col gap-2 border-t border-border py-6 text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between md:py-4">
        <p>© 2026 Daniela Brito</p>
        <nav aria-label="Footer navigation" className="flex items-center gap-2 md:gap-6">
          {/* TODO: Replace disabled placeholders when approved destinations exist. */}
          {['Privacy', 'Terms', 'Instagram'].map((label, index) => <span key={label} className="inline-flex items-center gap-2">{index > 0 && <span aria-hidden="true" className="md:hidden">·</span>}<a role="link" aria-disabled="true" className="inline-flex min-h-11 items-center">{label}</a></span>)}
        </nav>
      </div>
    </footer>
  )
}
