"use client";

import { useEffect, useState } from "react";
import { StudentActivityProvider, useStudentActivityContext } from "../../Components/contexts/StudentActivityContext";
import ProfileManagement from "./ProfileManagement";
import SkillGapAnalyzer from "./SkillGapAnalyzer";

function StudentDashboardContent() {
    const [active, setActive] = useState("profile");
    const { applications, savedInternships, loading, error, loadMyApplications, loadSavedInternships } = useStudentActivityContext();

    useEffect(() => {
        void loadMyApplications();
        void loadSavedInternships();
    }, [loadMyApplications, loadSavedInternships]);

    return (
        <div>
            <div className="flex gap-4 p-4">
                <button
                    onClick={() => setActive("profile")}
                    className="px-4 py-2 border rounded"
                >
                    Profile Management
                </button>

                <button
                    onClick={() => setActive("skill")}
                    className="px-4 py-2 border rounded"
                >
                    Skill Gap Analyzer
                </button>
            </div>

            <div className="mx-4 mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">My Applications</h3>
                        {loading ? <span className="text-sm text-slate-500">Loading…</span> : null}
                    </div>
                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                    {!loading && applications.length === 0 && !error ? (
                        <p className="mt-3 text-sm text-slate-500">You have no applications yet.</p>
                    ) : null}
                    <div className="mt-3 space-y-2">
                        {applications.map((application) => (
                            <div key={application._id} className="rounded-xl border border-slate-200 bg-white p-3">
                                <p className="font-medium text-slate-900">{typeof application.internshipId === "object" && application.internshipId ? application.internshipId.title : "Internship"}</p>
                                <p className="text-sm text-slate-500">Status: {application.status}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-lg font-semibold text-slate-900">Saved Internships</h3>
                    {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                    {!loading && savedInternships.length === 0 && !error ? (
                        <p className="mt-3 text-sm text-slate-500">You have no saved internships.</p>
                    ) : null}
                    <div className="mt-3 space-y-2">
                        {savedInternships.map((item, index) => (
                            <div key={item._id ?? `${item.internshipId}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
                                <p className="font-medium text-slate-900">
                                    {typeof item.internshipId === "object" && item.internshipId && "title" in item.internshipId ? item.internshipId.title : "Saved internship"}
                                </p>
                                <p className="text-sm text-slate-500">Saved for later</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {active === "profile" ? (
                <ProfileManagement />
            ) : (
                <SkillGapAnalyzer />
            )}
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <StudentActivityProvider>
            <StudentDashboardContent />
        </StudentActivityProvider>
    );
}