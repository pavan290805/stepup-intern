type RecruiterProfileCardProps = {
  name: string;
  role: string;
  stats: Array<{ label: string; value: number }>;
  onEditProfile: () => void;
};

export default function RecruiterProfileCard({
  name,
  role,
  stats,
  onEditProfile,
}: RecruiterProfileCardProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-18 bg-gradient-to-r from-[#E8F2FF] to-white" />
      <button
        type="button"
        aria-label="Edit recruiter profile"
        className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-sm text-slate-500 shadow-sm transition hover:border-[#0880EF] hover:text-[#0880EF]"
        onClick={onEditProfile}
      >
        ✎
      </button>
      <div className="px-5 pb-5 text-center">
        <div className="mx-auto -mt-10 grid h-20 w-20 place-items-center rounded-2xl border-4 border-white bg-[linear-gradient(135deg,#dceafe,#8bc0ff)] text-lg font-bold text-[#0B5CC4] shadow-md">
          ER
        </div>
        <h2 className="mt-4 text-lg font-semibold">{name}</h2>
        <p className="text-sm text-slate-500">{role}</p>
        <div className="mt-4 flex items-center justify-center">
          <div className="inline-flex items-center rounded-full bg-[#EAF2FF] px-4 py-2 text-sm font-medium text-[#0B5CC4]">
            Premium Account
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-left text-sm">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-slate-500">{stat.label}</p>
              <p className="mt-1 font-semibold text-[#0B5CC4]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}