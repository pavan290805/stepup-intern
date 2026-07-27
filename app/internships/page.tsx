"use client";

import { useEffect, useState } from "react";
import { CompanyProvider, useCompanyContext } from "../../Components/contexts/CompanyContext";
import {
  listInternships,
  InternshipApiItem,
  applyForInternship,
} from "@/lib/api";

function InternshipsContent() {
  const { companies, selectedCompany, loading, error, loadCompanies, loadCompanyById } = useCompanyContext();
  const [internships, setInternships] = useState<InternshipApiItem[]>([]);

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
      }
    }

    load();
  }, []);

  const handleApply = async (internshipId: string) => {
    try {
      await applyForInternship({
        internshipId,
      });

      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to apply.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Internships</h1>
        <p className="mt-6 text-lg leading-8 text-slate-700">
          Browse open internship opportunities and apply from your student account.
        </p>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Companies</h2>
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
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  {company.name}
                </button>
              ))}
            </div>
          </div>

          {selectedCompany ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{selectedCompany.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{selectedCompany.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                {selectedCompany.industry ? <span>Industry: {selectedCompany.industry}</span> : null}
                {selectedCompany.headquarters ? <span>Headquarters: {selectedCompany.headquarters}</span> : null}
                {selectedCompany.website ? <span>Website: {selectedCompany.website}</span> : null}
              </div>
            </div>
          ) : null}
        </div>

        <h2 className="mt-12 text-2xl font-bold">All Internships</h2>
        <div className="mt-6 grid gap-6">
          {internships.map((internship) => (
            <div
              key={internship._id}
              className="rounded-xl border p-6 shadow"
            >
              <h2 className="text-xl font-semibold">
                {internship.title}
              </h2>

              <p className="mt-2">{internship.description}</p>

              <p className="mt-3">
                📍 {internship.location}
              </p>

              <p>
                💰 ₹{internship.stipend}
              </p>

              <p>
                💼 {internship.workMode}
              </p>
              <button
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => handleApply(internship._id)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InternshipsPage() {
  return (
    <CompanyProvider>
      <InternshipsContent />
    </CompanyProvider>
  );
}
