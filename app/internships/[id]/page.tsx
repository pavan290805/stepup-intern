"use client";

import { useEffect, useState, use } from "react";
import { getInternship, applyForInternship, InternshipApiItem } from "@/lib/api";
import Link from "next/link";
import Header from "../../../layout/Header";

export default function InternshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [internship, setInternship] = useState<InternshipApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInternship(id);
        setInternship(data);
      } catch (err) {
        setError("Failed to load internship details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError(null);
    try {
      await applyForInternship({ internshipId: id });
      setApplySuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FF]">
        <Header />
        <div className="p-24 text-center text-lg text-slate-600 animate-pulse">Loading internship details...</div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-[#F5F8FF]">
        <Header />
        <div className="p-24 text-center text-lg text-red-600">Internship not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Header />
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg">
          <Link href="/internships" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
            &larr; Back to Internships
          </Link>
          
          {applySuccess ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center shadow-sm">
              <h2 className="text-3xl font-semibold text-green-800">Application Submitted!</h2>
              <p className="mt-3 text-lg text-green-700">You have successfully applied for this internship.</p>
              <Link href="/student" className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:translate-y-[-1px] transition">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{internship.title}</h1>
              <p className="text-lg text-slate-600 mt-2 font-medium">{internship.companyId?.name || "Company Name Unavailable"}</p>
              
              {error && <p className="mt-4 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">{error}</p>}
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-500">Location</p>
                  <p className="mt-1 font-semibold text-slate-900">{internship.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Mode</p>
                  <p className="mt-1 font-semibold text-slate-900 capitalize">{internship.workMode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Stipend</p>
                  <p className="mt-1 font-semibold text-slate-900">₹{internship.stipend}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Duration</p>
                  <p className="mt-1 font-semibold text-slate-900">{internship.duration}</p>
                </div>
              </div>

              <div className="mt-10 space-y-8">
                <section>
                  <h3 className="text-xl font-semibold text-slate-900">Description</h3>
                  <p className="mt-4 text-slate-700 whitespace-pre-wrap leading-relaxed">{internship.description}</p>
                </section>
                
                {internship.skillsRequired && internship.skillsRequired.length > 0 && (
                  <section>
                    <h3 className="text-xl font-semibold text-slate-900">Required Skills</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {internship.skillsRequired.map((skill, index) => (
                        <span key={index} className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
                
                <section className="border-t border-slate-200 pt-8 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-sm text-slate-600">Deadline: <span className="font-semibold text-slate-900">{new Date(internship.deadline).toLocaleDateString()}</span></p>
                    <p className="text-sm text-slate-600 mt-1">Openings: <span className="font-semibold text-slate-900">{internship.openings}</span></p>
                  </div>
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className={`rounded-2xl px-10 py-4 font-semibold text-white transition ${applying ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-200 hover:translate-y-[-1px] hover:shadow-xl hover:from-blue-700 hover:to-blue-800'}`}
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
