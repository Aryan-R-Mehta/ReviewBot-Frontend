import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-background">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-sm text-blue-300">
          🤖 AI-powered code reviews
        </div>

        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Hey Buddy!{" "}
          <span className="inline-block">😊</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
          Welcome to{" "}
          <span className="font-medium text-blue-400">ReviewBot</span>.
          <br />
          We help you reduce the time and effort required to review your code.
        </p>

        <div className="mt-8">
          <Link href="/register" className="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-400">
            Get Started →
          </Link>
        </div>
      </div>
    </main>
  );
}