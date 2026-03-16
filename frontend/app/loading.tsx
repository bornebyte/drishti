export default function GlobalLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center px-6">
      <div className="glass-panel w-full rounded-[2rem] p-8">
        <p className="section-title">Loading</p>
        <div className="mt-4 h-3 w-40 animate-pulse rounded-full bg-black/10" />
        <div className="mt-3 h-3 w-64 animate-pulse rounded-full bg-black/10" />
        <div className="mt-8 grid gap-3">
          <div className="h-20 animate-pulse rounded-[1.4rem] bg-white/70" />
          <div className="h-20 animate-pulse rounded-[1.4rem] bg-white/70" />
        </div>
      </div>
    </div>
  );
}
