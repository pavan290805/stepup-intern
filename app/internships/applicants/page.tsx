"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import InternshipApplicants from "../../../Components/internships/InternshipApplicants";
import { useRecruiterInternships, type Internship } from "../../../Components/hooks/useRecruiterInternships";

export default function InternshipApplicantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const internshipId = searchParams.get("internshipId");
  const { internships, loading } = useRecruiterInternships();
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  useEffect(() => {
    if (!internshipId || internships.length === 0) {
      return;
    }

    const found = internships.find((item) => item.id === internshipId) ?? null;
    setSelectedInternship(found);
  }, [internshipId, internships]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="mx-auto flex max-w-5xl items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <p className="text-slate-600">Loading internship applicants…</p>
        </div>
      );
    }

    if (!selectedInternship) {
      return (
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Applicants</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            Select an internship from the dashboard to view applicants.
          </p>
        </div>
      );
    }

    return (
      <InternshipApplicants
        internship={selectedInternship}
        onBack={() => router.push("/recruiter")}
      />
    );
  }, [loading, selectedInternship, router]);

  return <div className="min-h-screen bg-[#F5F8FF]">{content}</div>;
}
