import { useMemo, useState } from 'react';
import { Bike, BusFront, CarTaxiFront, CheckCircle2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PopularRoutes from './components/PopularRoutes';
import { LOCATIONS, ROUTES } from './data/routes';
import { supabase } from './supabase';

const getRoutePrice = (from, to) => {
  const direct = ROUTES[`${from}|${to}`];
  if (direct) return direct;

  const reverse = ROUTES[`${to}|${from}`];
  if (reverse) return reverse;

  return { trotro: 8, bolt: 42, okada: 24 };
};

function App() {
  const [from, setFrom] = useState('Madina');
  const [to, setTo] = useState('Circle');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportRoute, setReportRoute] = useState('Madina → Circle');
  const [reportFare, setReportFare] = useState('');
  const [status, setStatus] = useState('');

  const result = useMemo(() => getRoutePrice(from, to), [from, to]);

  const handleCheck = (event) => {
    event.preventDefault();
    setReportRoute(`${from} → ${to}`);
    setStatus('');
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleShare = () => {
    const shareText = `Trotro from ${from} to ${to} is GH₵${result.trotro}. Bolt is GH₵${result.bolt}, and okada is GH₵${result.okada}.`;
    const waLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();

    if (!reportFare.trim()) {
      setStatus('Please add a fare estimate before submitting.');
      return;
    }

    try {
      const { error } = await supabase.from('fare_reports').insert([
        {
          route: reportRoute,
          fare: Number(reportFare),
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        throw error;
      }

      setStatus('Thanks. Your fare report has been submitted.');
      setReportFare('');
      setShowReportModal(false);
    } catch (error) {
      setStatus('Saved locally. Connect Supabase to sync fare reports.');
      setShowReportModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <Navbar onReportClick={() => setShowReportModal(true)} />

      <main>
        <Hero
          from={from}
          to={to}
          locations={LOCATIONS}
          onFromChange={setFrom}
          onToChange={setTo}
          onCheck={handleCheck}
          onSwap={handleSwap}
          onReportClick={() => setShowReportModal(true)}
          onShare={handleShare}
          result={result}
        />

        <PopularRoutes />

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-400">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#111111]">Simple, transparent fares</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F5] text-[#111111]">
                <BusFront className="h-5 w-5" />
              </div>
              <div className="mb-2 inline-flex rounded-full bg-[#F5F5F5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                01
              </div>
              <h3 className="text-xl font-semibold text-[#111111]">Pick a route</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Choose a destination pair to quickly compare your commuting options.
              </p>
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F5] text-[#111111]">
                <CarTaxiFront className="h-5 w-5" />
              </div>
              <div className="mb-2 inline-flex rounded-full bg-[#F5F5F5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                02
              </div>
              <h3 className="text-xl font-semibold text-[#111111]">Compare fares</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                See the latest trotro, Bolt, and okada price ranges before heading out.
              </p>
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F5] text-[#111111]">
                <Bike className="h-5 w-5" />
              </div>
              <div className="mb-2 inline-flex rounded-full bg-[#F5F5F5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                03
              </div>
              <h3 className="text-xl font-semibold text-[#111111]">Ride with confidence</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Save time and money by choosing the trip that fits your schedule and budget.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#111111] py-6 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 TrotroPrice</p>
          <div className="flex items-center gap-6 text-neutral-300">
            <a href="#popular-routes" className="hover:text-white">Top Routes</a>
            <button type="button" onClick={() => setShowReportModal(true)} className="hover:text-white">
              Report Fare
            </button>
          </div>
        </div>
      </footer>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[28px] border border-neutral-200 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-400">Report fare</p>
                <h3 className="mt-2 text-2xl font-bold text-[#111111]">Share a new price</h3>
              </div>
              <button type="button" onClick={() => setShowReportModal(false)} className="text-xl text-neutral-500">
                ×
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-600">Route</label>
                <input
                  value={reportRoute}
                  onChange={(event) => setReportRoute(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-[#F5F5F5] px-4 text-sm text-[#111111] outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-600">Fare in GH₵</label>
                <input
                  type="number"
                  min="0"
                  value={reportFare}
                  onChange={(event) => setReportFare(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-[#F5F5F5] px-4 text-sm text-[#111111] outline-none focus:border-neutral-400"
                  placeholder="e.g. 9"
                />
              </div>

              {status && (
                <div className="flex items-center gap-2 rounded-2xl bg-[#F5F5F5] px-3 py-2 text-sm text-[#111111]">
                  <CheckCircle2 className="h-4 w-4 text-[#00A651]" />
                  {status}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-[#111111] hover:border-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#FFC400] px-4 py-2 text-sm font-semibold text-[#111111] hover:brightness-95"
                >
                  Submit report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
