import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  return (
    <main className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      <section
        className="relative hidden min-h-screen overflow-hidden bg-primary-dark lg:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-primary-dark" />

        <div className="absolute bottom-14 left-12 xl:bottom-16 xl:left-16">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-background">
            Stronger
          </p>

          <p className="mt-3 text-xs font-medium uppercase tracking-[0.32em] text-background">
            Healthier
          </p>

          <p className="mt-3 text-xs font-medium uppercase tracking-[0.32em] text-background">
            More capable
          </p>

          <p className="mt-3 text-xs font-medium uppercase tracking-[0.32em] text-background">
            For what's next.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          <header className="mb-16 -translate-y-5 text-center">
            <p className="text-xl font-normal uppercase tracking-[0.3em] text-foreground sm:text-[22px]">
              Daniela Brito
            </p>

            <p className="mt-2.5 text-[9px] font-normal uppercase tracking-[0.24em] text-muted-foreground sm:text-[10px]">
              Strength for what's next
            </p>
          </header>

          <div>
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create your account to access your programs and workouts.
            </p>

            <div className="mt-8">
              <RegisterForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage