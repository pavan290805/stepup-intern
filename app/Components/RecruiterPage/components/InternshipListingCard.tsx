import type { Internship } from "../useRecruiterInternships";

type InternshipListingCardProps = {
  internship: Internship;
  formatDate: (value: string) => string;
  onEdit: (internship: Internship) => void;
  onFeature: (id: string) => void;
  onClose: (id: string) => void;
  onReopen: (id: string) => void;
  onDelete: (id: string) => void;
  onViewApplicants: (internship: Internship) => void;
};

export default function InternshipListingCard({
  internship,
  formatDate,
  onEdit,
  onFeature,
  onClose,
  onReopen,
  onViewApplicants,
}: InternshipListingCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-[#FBFDFF] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-semibold text-slate-900">{internship.title}</h4>
            <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-semibold text-[#0B5CC4]">
              {internship.status}
            </span>
            {internship.featured ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Featured
              </span>
            ) : null}
          </div>
          <p className="text-sm text-slate-600">
            {internship.department} · {internship.location} · {internship.type}
          </p>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">{internship.description}</p>
          <p className="text-sm text-slate-500">
            Compensation: <span className="font-medium text-slate-700">{internship.stipend}</span> · Deadline:{" "}
            <span className="font-medium text-slate-700">{formatDate(internship.deadline)}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            onClick={() => onViewApplicants(internship)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50"
          >
            View Applicants
          </button>
          <button
            type="button"
            onClick={() => onEdit(internship)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0880EF] hover:text-[#0880EF]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onFeature(internship.id)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:text-amber-600"
          >
            {internship.featured ? "Remove Feature" : "Feature"}
          </button>
          {internship.status === "Closed" ? (
            <button
              type="button"
              onClick={() => onReopen(internship.id)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-600"
            >
              Reopen
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onClose(internship.id)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
            >
              Close
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(internship.id)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}