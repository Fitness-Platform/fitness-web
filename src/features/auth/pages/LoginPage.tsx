import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <main className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[0.92fr_1.08fr]">
      {/* Editorial image area */}
      <section
        className="relative hidden min-h-screen overflow-hidden bg-primary-dark lg:block"
        aria-hidden="true"
      >
        {/*
          Replace with Daniela's approved photography
          when the final asset is available.

          <img
            src={loginImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        */}

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

      {/* Authentication area */}
      <section className="flex min-h-screen items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          {/* Brand */}
          <header className="mb-16 -translate-y-5 text-center">
            <p className="text-xl font-normal uppercase tracking-[0.3em] text-foreground sm:text-[22px]">
              Daniela Brito
            </p>

            <p className="mt-2.5 text-[9px] font-normal uppercase tracking-[0.24em] text-muted-foreground sm:text-[10px]">
              Strength for what's next
            </p>
          </header>

          {/* Login content */}
          <div>
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
              Sign in to your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Access your programs, workouts and resources.
            </p>

            <div className="mt-8">
              <LoginForm />
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <span className="font-medium text-foreground">
                Create account
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
