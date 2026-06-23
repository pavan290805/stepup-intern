import InternshipApplicants from "../../../components/internships/InternshipApplicants";

export default function InternshipApplicantsPage() {
  return (
    <div className="min-h-screen bg-[#F5F8FF] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Applicants</h1>
        <p className="mt-6 text-lg leading-8 text-slate-700">
          Select an internship from the dashboard to view applicants.
        </p>
      </div>
    </div>
  );
}
