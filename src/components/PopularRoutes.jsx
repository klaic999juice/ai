const popularRoutes = [
  { from: 'Madina', to: 'Circle', fare: 'GH₵8' },
  { from: 'Legon', to: 'Achimota', fare: 'GH₵4' },
  { from: 'Circle', to: 'Osu', fare: 'GH₵5' },
  { from: 'Kaneshie', to: 'Lapaz', fare: 'GH₵5' },
  { from: 'Airport', to: 'Circle', fare: 'GH₵10' },
  { from: 'Spintex', to: 'Madina', fare: 'GH₵12' },
];

export default function PopularRoutes() {
  return (
    <section id="popular-routes" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-400">Popular routes</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#111111]">Most checked fares</h2>
        </div>
        <a href="#" className="hidden text-sm font-medium text-neutral-600 hover:text-[#111111] sm:inline-flex">
          View all routes
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {popularRoutes.map((route) => (
          <div key={`${route.from}-${route.to}`} className="rounded-[24px] border border-neutral-200 bg-[#F5F5F5] p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500">{route.from}</p>
                <p className="mt-1 text-xl font-bold text-[#111111]">
                  {route.from} → {route.to}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#111111]">
                {route.fare}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
