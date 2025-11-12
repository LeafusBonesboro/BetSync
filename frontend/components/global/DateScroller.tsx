'use client';

interface DateScrollerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DateScroller({ selectedDate, onSelectDate }: DateScrollerProps) {
  const today = new Date();

  // Generate 7 days (3 before + today + 3 after)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 3 + i);
    const iso = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return { iso, label };
  });

  return (
    <div className="flex overflow-x-auto gap-2 px-4 py-2 border-b border-gray-800 bg-[#0B0B0F]">
      {days.map((d) => {
        const isActive = d.iso === selectedDate;
        return (
          <button
            key={d.iso}
            onClick={() => onSelectDate(d.iso)}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
              isActive
                ? 'bg-amber-500 text-black font-semibold'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}
