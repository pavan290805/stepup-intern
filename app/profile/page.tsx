export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#F5F8FF] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0880EF]">Profile</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Recruiter profile workspace
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
          Profile editing is available in the recruiter dashboard. This fallback keeps the route available while the
          build no longer depends on the missing component bundle.
        </p>
      </div>
    </main>
  );
}
