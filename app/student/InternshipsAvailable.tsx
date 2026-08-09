"use client";

import { useEffect, useState } from "react";
import { CompanyProvider, useCompanyContext } from "../../Components/contexts/CompanyContext";
import { listInternships, InternshipApiItem } from "@/lib/api";
import Link from "next/link";

function InternshipsAvailableContent() {
  const { companies, selectedCompany, loading, error, loadCompanies, loadCompanyById } = useCompanyContext();
  const [internships, setInternships] = useState<InternshipApiItem[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(true);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    async function load() {
      try {
        const data = await listInternships();
        setInternships(data.internships);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInternships(false);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Available Internships</h2>
        <p className="mt-2 text-sm text-slate-600">
          Browse open internship opportunities from our partners and apply with one click.
        </p>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-semibold text-slate-900">Filter by Company</h3>
              {loading ? <span className="text-sm text-slate-500">Loading…</span> : null}
            </div>

            {error ? (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            ) : null}

            {!loading && companies.length === 0 && !error ? (
              <p className="mt-3 text-sm text-slate-500">No companies are available right now.</p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
              {companies.map((company) => (
                <button
                  key={company._id}
                  type="button"
                  onClick={() => void loadCompanyById(company._id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedCompany?._id === company._id 
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900"
                  }`}
                >
                  {company.name}
                </button>
              ))}
              {selectedCompany && (
                 <button
                 type="button"
                 onClick={() => void loadCompanies()} // Reloading clears the selected context effectively, or you might need a clear func. For now just refetch/clear visually by not re-selecting.
                 className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
               >
                 Clear Filter
               </button>
              )}
            </div>
          </div>

          {selectedCompany ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900">{selectedCompany.name}</h3>
              <p className="mt-2 text-sm text-blue-800/80">{selectedCompany.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-blue-700">
                {selectedCompany.industry ? <span className="bg-blue-100 px-2.5 py-1 rounded-md">Industry: {selectedCompany.industry}</span> : null}
                {selectedCompany.headquarters ? <span className="bg-blue-100 px-2.5 py-1 rounded-md">HQ: {selectedCompany.headquarters}</span> : null}
                {selectedCompany.website ? <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="bg-blue-100 px-2.5 py-1 rounded-md hover:underline">Website</a> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {loadingInternships ? (
          <div className="md:col-span-2 text-center py-10 text-slate-500 animate-pulse bg-white rounded-2xl border border-slate-200 shadow-sm">Loading internships...</div>
        ) : internships.length === 0 ? (
          <div className="md:col-span-2 text-center py-10 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-lg font-medium text-slate-900">No internships found</p>
            <p>Check back later for new opportunities.</p>
          </div>
        ) : (
          internships
            .filter((internship) => !selectedCompany || internship.companyId === selectedCompany._id)
            .map((internship) => (
            <div
              key={internship._id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-blue-200"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
                    {internship.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200">
                    Active
                  </span>
                </div>
                
                <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">{internship.description}</p>
                
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-medium text-slate-700">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="text-slate-400">📍</span> {internship.location}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="text-slate-400">💰</span> ₹{internship.stipend}
                  </div>
                  <div className="col-span-2 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="text-slate-400">💼</span> {internship.workMode}
                  </div>
                </div>
              </div>

              <Link
                href={`/internships/${internship._id}`}
                className="mt-6 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View Details & Apply
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function InternshipsAvailable() {
  return (
    <CompanyProvider>
      <InternshipsAvailableContent />
    </CompanyProvider>
  );
}
