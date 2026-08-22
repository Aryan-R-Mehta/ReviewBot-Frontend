export default function Signup() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Left side */}
      <section className="relative flex w-1/2 items-center justify-center px-12 lg:px-20">
        <div className="max-w-lg">
          <div className="mb-6 text-4xl">👋</div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Oh, you're new here!
          </h1>

          <p className="mt-5 text-lg leading-8 text-muted">
            Sorry, I know you're probably in a hurry to get your PR reviewed.
          </p>

          <p className="mt-3 text-lg leading-8 text-muted">
            I just need to connect with your GitHub account once so I can
            understand who you are, keep track of your reviews, and give you
            a better ReviewBot experience.
          </p>

          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            No long forms. No boring setup. Just connect GitHub and you're
            good to go. 🚀
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="h-64 w-px bg-linear-to-b from-transparent via-border to-transparent" />
      </div>

      {/* Right side */}
      <section className="relative flex w-1/2 items-center justify-center px-12 lg:px-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              Connect your GitHub
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              One click and we'll take care of the rest.
            </p>
          </div>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/github/`}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background/70 px-5 py-3.5 text-sm font-medium text-foreground transition hover:bg-card-hover"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden="true"
            >
              {/* path */}
            </svg>

            Continue with GitHub
          </a>
        </div>
      </section>
    </main>
  );
}