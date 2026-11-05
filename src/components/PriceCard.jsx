export default function PriceCard({ icon: Icon, label, amount, caption, amountColor = '#111111', tone = 'default' }) {
  const toneClass = {
    default: 'border-neutral-200 bg-white',
    green: 'border-[#dff7ea] bg-[#F7FFF9]',
    yellow: 'border-[#fff1b8] bg-[#fff9dc]',
  };

  return (
    <div className={`rounded-[24px] border p-5 shadow-soft ${toneClass[tone]}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F5F5] text-[#111111]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">{label}</p>
            <p className="text-[11px] text-neutral-400">{caption}</p>
          </div>
        </div>
        <span className="text-2xl font-bold" style={{ color: amountColor }}>
          GH₵{amount}
        </span>
      </div>
    </div>
  );
}
