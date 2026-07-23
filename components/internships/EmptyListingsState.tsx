export default function EmptyListingsState() {
  return (
    <div className="rounded-3xl border border-dashed border-[#C9DDF8] bg-[linear-gradient(180deg,#f7fbff,#eef5ff)] px-6 py-14 text-center shadow-sm">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white text-2xl text-[#0880EF] shadow-md">
        ✦
      </div>
      <h4 className="text-xl font-semibold text-slate-900">No current internship listings</h4>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        Your recruiting board is empty for now. Create a listing to start building the internship pipeline,
        then return here to review and edit each role.
      </p>
    </div>
  );
}