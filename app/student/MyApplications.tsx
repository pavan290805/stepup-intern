"use client";

import { useStudentActivityContext } from "../../Components/contexts/StudentActivityContext";

export default function MyApplications() {
  const { applications, savedInternships, loading, error } = useStudentActivityContext();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-xl font-semibold text-slate-900">My Applications</h3>
          {loading ? <span className="text-sm text-slate-500 animate-pulse">Loading…</span> : null}
        </div>
        {error ? <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p> : null}
        {!loading && applications.length === 0 && !error ? (
          <div className="mt-8 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-sm font-medium text-slate-900">No applications yet</p>
            <p className="mt-1 text-sm text-slate-500">When you apply for internships, they will appear here.</p>
          </div>
        ) : null}
        <div className="mt-6 space-y-4">
          {applications.map((application) => (
            <div key={application._id} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:border-blue-200 hover:shadow-md">
              <p className="font-semibold text-slate-900">{typeof application.internshipId === "object" && application.internshipId ? application.internshipId.title : "Internship"}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  application.status === 'Applied' ? 'bg-blue-100 text-blue-800' : 
                  application.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'Offered' ? 'bg-green-100 text-green-800' :
                  application.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {application.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-xl font-semibold text-slate-900">Saved Internships</h3>
          {loading ? <span className="text-sm text-slate-500 animate-pulse">Loading…</span> : null}
        </div>
        {error ? <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p> : null}
        {!loading && savedInternships.length === 0 && !error ? (
          <div className="mt-8 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
              <span className="text-2xl">🔖</span>
            </div>
            <p className="text-sm font-medium text-slate-900">No saved internships</p>
            <p className="mt-1 text-sm text-slate-500">Internships you save for later will show up here.</p>
          </div>
        ) : null}
        <div className="mt-6 space-y-4">
          {savedInternships.map((item, index) => (
            <div key={item._id ?? `${item.internshipId}-${index}`} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:border-blue-200 hover:shadow-md">
              <p className="font-semibold text-slate-900">
                {typeof item.internshipId === "object" && item.internshipId && "title" in item.internshipId ? item.internshipId.title : "Saved internship"}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-slate-500">Saved for later</p>
                <button className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
