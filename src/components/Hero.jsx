import { ArrowRightLeft, BadgeCheck, Bike, BusFront, CarTaxiFront, MessageCircle } from 'lucide-react';

export default function Hero({
  from,
  to,
  locations,
  onFromChange,
  onToChange,
  onCheck,
  onSwap,
  onReportClick,
  onShare,
  result,
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-neutral-200 bg-[#F5F5F5] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111111]">
            Live fares in Accra
          </div>

          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-[3.2rem]">
            How much is Trotro from {from} to {to}?
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-neutral-500 lg:text-lg">
            Compare the cheapest way to commute across Accra with clear, up-to-date fare estimates for trotro, Bolt, and okada.
          </p>

          <form onSubmit={onCheck} className="mt-8 w-full max-w-xl rounded-[28px] border border-neutral-200 bg-white p-4 shadow-soft sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  From
                </label>
                <select
                  value={from}
                  onChange={(event) => onFromChange(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-[#F5F5F5] px-4 text-sm font-medium text-[#111111] outline-none transition focus:border-neutral-400"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  To
                </label>
                <select
                  value={to}
                  onChange={(event) => onToChange(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-[#F5F5F5] px-4 text-sm font-medium text-[#111111] outline-none transition focus:border-neutral-400"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#FFC400] px-5 text-base font-semibold text-[#111111] shadow-sm hover:brightness-95"
              >
                Check Price
              </button>

              <button
                type="button"
                onClick={onSwap}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-medium text-[#111111] hover:border-neutral-300"
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Swap
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
              <span>Trusted by 2,400+ commuters</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onReportClick}
                  className="font-medium text-[#111111] underline-offset-4 hover:underline"
                >
                  Report fare
                </button>
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 font-medium text-[#111111] hover:border-neutral-300"
                >
                  <MessageCircle className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-[26px] border border-neutral-200 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F5F5] text-[#111111]">
                  <BusFront className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Trotro</p>
                  <p className="text-[11px] text-neutral-400">Most affordable</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-[#111111]">GH₵{result.trotro}</span>
            </div>
            <div className="h-px bg-neutral-200" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Route</span>
              <span className="text-sm font-medium text-neutral-600">
                {from} → {to}
              </span>
            </div>
          </div>

          <div className="rounded-[26px] border border-neutral-200 bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F5F5] text-[#111111]">
                  <CarTaxiFront className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Bolt</p>
                  <p className="text-[11px] text-neutral-400">Comfort option</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-[#111111]">GH₵{result.bolt}</span>
            </div>
            <div className="h-px bg-neutral-200" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Difference</span>
              <span className="text-sm font-medium text-neutral-600">{result.bolt - result.trotro} more</span>
            </div>
          </div>

          <div className="rounded-[26px] border border-[#dff7ea] bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8FAF1] text-[#00A651]">
                  <Bike className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500">Okada</p>
                  <p className="text-[11px] text-neutral-400">Fastest route</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-[#00A651]">GH₵{result.okada}</span>
            </div>
            <div className="h-px bg-neutral-200" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.12em] text-neutral-400">Value</span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[#00A651]">
                <BadgeCheck className="h-4 w-4" />
                Affordable option
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
