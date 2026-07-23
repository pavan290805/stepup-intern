export default function ClosedInternshipsPage() {
  return (
    <main className="min-h-screen bg-[#F5F8FF] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0880EF]">Closed Internships</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Review closed internship listings
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
          This section is available in the recruiter workspace. Use the main internships page to manage active
          listings and move roles to closed when they are filled.
        </p>
      </div>
    </main>
  );
}
