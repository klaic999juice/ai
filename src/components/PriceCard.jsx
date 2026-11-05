export default function PriceCard({ icon: Icon, label, amount, caption, tone = 'default' }) {
  const toneClass = {
    default: 'border-neutral-200 bg-white text-[#111111]',
    green: 'border-[#00A651]/20 bg-white text-[#00A651]',
  };

  const iconClass = tone === 'green' ? 'text-[#00A651]' : 'text-[#111111]';
  const amountClass = tone === 'green' ? 'text-[#00A651]' : 'text-[#111111]';

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${toneClass[tone]}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F5F5] ${iconClass}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-semibold text-[#111111]">{label}</p>
            <p className="mt-1 text-sm text-neutral-500">{caption}</p>
          </div>
        </div>
        <span className={`whitespace-nowrap text-xl font-bold tracking-tight sm:text-2xl ${amountClass}`}>
          GH₵{amount}
        </span>
      </div>
    </div>
  );
}
