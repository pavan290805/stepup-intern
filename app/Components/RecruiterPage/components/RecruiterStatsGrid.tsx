type RecruiterStatsGridProps = {
  stats: Array<{ label: string; value: number }>;
  compact?: boolean;
};

export default function RecruiterStatsGrid({ stats, compact = false }: RecruiterStatsGridProps) {
  const gridClassName = compact
    ? "mt-4 grid grid-cols-2 gap-3"
    : "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  const cardClassName = compact
    ? "rounded-2xl border border-slate-200 bg-[#FBFDFF] px-3 py-3 text-center"
    : "rounded-2xl border border-slate-200 bg-[#FBFDFF] px-5 py-4 text-center";

  const labelClassName = compact
    ? "text-[0.65rem] uppercase tracking-[0.16em] text-slate-500"
    : "text-xs uppercase tracking-[0.2em] text-slate-500";

  const valueClassName = compact
    ? "mt-1 text-xl font-semibold text-[#0B5CC4]"
    : "mt-2 text-2xl font-semibold text-[#0B5CC4]";

  return (
    <div className={gridClassName}>
      {stats.map((stat) => (
        <div key={stat.label} className={cardClassName}>
          <p className={labelClassName}>{stat.label}</p>
          <p className={valueClassName}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}