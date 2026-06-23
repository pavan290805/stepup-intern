import Header from "../../components/layout/Header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F5F8FF] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0880EF]">About StepUp Intern</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">A modern intern hiring experience for recruiters</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
          StepUp Intern helps recruiters manage listings, review applicants, and move candidates through hiring stages with clean dashboards and intuitive workflows.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6">
            <h2 className="text-xl font-semibold text-slate-900">Modern ATS design</h2>
            <p className="mt-3 text-sm text-slate-600">A polished recruiter experience with cards, tables, badges, and action-driven layouts.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6">
            <h2 className="text-xl font-semibold text-slate-900">Built for scale</h2>
            <p className="mt-3 text-sm text-slate-600">Organize internships, candidate pipelines, interviews, and activity in one place.</p>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
