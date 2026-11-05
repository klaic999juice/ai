import { ArrowRightLeft, BusFront, CarTaxiFront, MessageCircle, Bike } from 'lucide-react';

export default function Navbar({ onReportClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white">
            T
          </div>
          <span className="text-xl font-semibold tracking-tight text-[#111111]">TrotroPrice</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#111111] md:flex">
          <a href="#popular-routes" className="transition hover:text-neutral-600">
            Top Routes
          </a>
          <button type="button" onClick={onReportClick} className="transition hover:text-neutral-600">
            Report Fare
          </button>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-[#111111] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 md:px-5"
        >
          Login
        </button>
      </div>
    </header>
  );
}
