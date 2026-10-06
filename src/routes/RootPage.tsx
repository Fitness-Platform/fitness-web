function RootPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary-dark">
          Fitness Platform
        </p>

        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Visual foundation is running.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
          Tailwind, Inter, and the Fitness Platform design tokens are configured.
        </p>

        <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
          <span className="h-4 w-4 bg-primary" />
          <span className="text-sm text-muted-foreground">
            Eucalyptus accent
          </span>
        </div>
      </div>
    </main>
  )
}

export default RootPage