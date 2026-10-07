const GUTTER = "px-4 sm:px-6 lg:px-8";

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-zinc-50"
      aria-busy="true"
      aria-label="Loading collection"
    >
      {/* Hero skeleton */}
      <section className="relative min-h-[480px] animate-pulse overflow-hidden bg-zinc-900 sm:min-h-[450px] lg:min-h-[560px]">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-700" />

        <div
          className={`relative mx-auto flex min-h-[480px] max-w-full items-end py-10 sm:min-h-[450px] sm:py-16 lg:min-h-[560px] lg:py-20 ${GUTTER}`}
        >
          <div className="w-full max-w-2xl">
            <div className="h-3 w-28 rounded bg-white/20" />
            <div className="mt-6 h-14 max-w-md rounded bg-white/20 sm:h-20" />
            <div className="mt-5 h-5 max-w-xl rounded bg-white/15" />
            <div className="mt-3 h-5 max-w-lg rounded bg-white/15" />
            <div className="mt-8 h-12 w-44 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Product grid skeleton */}
      <section className={`mx-auto max-w-full py-10 sm:py-16 ${GUTTER}`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              <div className="aspect-[4/4.7] animate-pulse bg-zinc-200" />

              <div className="space-y-3 p-3 sm:p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100" />
                <div className="h-9 animate-pulse rounded-full bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}