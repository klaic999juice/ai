import { ArrowRightLeft, Bike, BusFront, CarTaxiFront, MessageCircle } from 'lucide-react';
import PriceCard from './PriceCard';

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
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-24">
      <div className="grid items-start gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-20">
        <div>
          <p className="mb-6 text-sm font-medium text-neutral-500">Live fares in Accra</p>

          <h1 className="max-w-2xl text-[2.5rem] font-extrabold leading-[1.08] tracking-[-0.055em] text-[#111111] sm:text-5xl lg:text-[3.25rem]">
            How much is Trotro from {from} to {to}?
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-neutral-500 sm:text-lg">
            Compare trotro, Bolt, and okada fares before you head out.
          </p>

          <form onSubmit={onCheck} className="mt-10 w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div>
                <label htmlFor="route-from" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                  From
                </label>
                <select
                  id="route-from"
                  value={from}
                  onChange={(event) => onFromChange(event.target.value)}
                  className="h-14 w-full rounded-xl border-0 bg-[#F5F5F5] px-4 text-base font-medium text-[#111111] outline-none ring-1 ring-transparent transition focus:ring-neutral-300"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={onSwap}
                aria-label="Swap locations"
                className="hidden h-12 w-12 items-center justify-center rounded-full border border-neutral-200 text-[#111111] transition hover:bg-[#F5F5F5] sm:flex"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>

              <div>
                <label htmlFor="route-to" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                  To
                </label>
                <select
                  id="route-to"
                  value={to}
                  onChange={(event) => onToChange(event.target.value)}
                  className="h-14 w-full rounded-xl border-0 bg-[#F5F5F5] px-4 text-base font-medium text-[#111111] outline-none ring-1 ring-transparent transition focus:ring-neutral-300"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-5 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[#FFC400] px-8 text-base font-semibold text-[#111111] transition hover:brightness-95 sm:min-w-44"
              >
                Check price
              </button>
              <span className="text-sm text-neutral-500">Trusted by 2,400+ commuters</span>
            </div>

            <div className="mt-5 flex items-center gap-5 text-sm text-neutral-500">
              <button type="button" onClick={onReportClick} className="transition hover:text-[#111111]">
                Report fare
              </button>
              <button type="button" onClick={onShare} className="inline-flex items-center gap-2 transition hover:text-[#111111]">
                <MessageCircle className="h-4 w-4" />
                Share on WhatsApp
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-3 lg:pt-10">
          <PriceCard icon={BusFront} label="Trotro" amount={result.trotro} caption="Most affordable" />
          <PriceCard icon={CarTaxiFront} label="Bolt" amount={result.bolt} caption="Comfort option" />
          <PriceCard icon={Bike} label="Okada" amount={result.okada} caption="Fastest option" tone="green" />
          <p className="pt-2 text-sm text-neutral-400">Estimated fares for {from} to {to}</p>
        </div>
      </div>
    </section>
  );
}
