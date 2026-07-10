"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../Components/Navbar";
import { apiFetch } from "@/lib/api";

const sources = [
  { label: "University Recruiting", count: 5200, color: "bg-blue-600" },
  { label: "Direct Application", count: 3840, color: "bg-blue-400" },
  { label: "Referral Program", count: 2100, color: "bg-blue-300" },
  { label: "LinkedIn Sourcing", count: 1342, color: "bg-blue-200" },
];

const funnelStages = [
  { label: "Applied", value: 12482, sub: "100% of pipeline", dark: false },
  { label: "Screening", value: 4820, sub: "38.6% Conversion", dark: false },
  { label: "Technical Interview", value: 1240, sub: "25.7% Conversion", dark: false },
  { label: "Final Round", value: 412, sub: "33.2% Conversion", dark: false },
  { label: "Offered", value: 118, sub: "28.6% Conversion", dark: true },
];



const maxSource = Math.max(...sources.map((s) => s.count));

export default function AnalyticsPage() {
  const router = useRouter();
  const [internships, setInternships] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const profileResponse = await apiFetch("/recruiters/profile");
        const companyId =
          profileResponse?.data?.companyId?._id ||
          profileResponse?.data?.companyId?.id ||
          profileResponse?.data?.companyId;

        if (!companyId) {
          return;
        }
        console.log("Company ID:", companyId);
        const internshipsResponse = await apiFetch(`/internships?company=${companyId}&limit=100`);
        const data = internshipsResponse?.data?.internships || [];
        console.log("Internships:", data); 
        setInternships(data);
      } catch (error) {
        if (!(error instanceof Error && error.message.includes("404"))) {
          console.error(error);
        }
      }
    };

    loadAnalytics();
  }, []);

  const totalApplicants = internships.reduce((sum, internship) => sum + (internship.applicationsCount || 0), 0);
  const activeRoles = internships.filter((internship) => internship.status === "active").length;
  const avgDaysToDeadline = internships.length
    ? Math.max(
        0,
        Math.round(
          internships.reduce((sum, internship) => {
            const days = Math.max(0, Math.ceil((new Date(internship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            return sum + days;
          }, 0) / internships.length
        )
      )
    : 18;

  const statCards = [
    {
      label: "Total Applicants",
      value: totalApplicants ? totalApplicants.toLocaleString() : "12,482",
      change: internships.length ? "Live from backend" : "+34.2% vs last month",
      changeType: "up",
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 11-4 0 2 2 0 014 0zM5 16a2 2 0 11-4 0 4 4 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Hiring Velocity",
      value: `${avgDaysToDeadline} Days`,
      change: internships.length ? "Derived from active openings" : "−2 days (Faster)",
      changeType: "up",
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Offer Accept Rate",
      value: internships.length ? `${Math.min(100, Math.max(0, Math.round((activeRoles / Math.max(1, internships.length)) * 100)))}%` : "88.4%",
      change: internships.length ? "From current recruiter pipeline" : "Stable",
      changeType: "neutral",
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Active Roles",
      value: String(activeRoles || 42),
      change: internships.length ? `${internships.filter((internship) => internship.status === "closed").length} closing soon` : "12 closing soon",
      changeType: "warn",
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

const velocityData = internships.map((internship) => ({
  month: new Date(internship.createdAt).toLocaleString("default", {
    month: "short",
  }),
  days: Math.max(
    0,
    Math.ceil(
      (new Date(internship.deadline).getTime() -
        new Date(internship.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  ),
}));

const maxVelocity =
  velocityData.length > 0
    ? Math.max(...velocityData.map((d) => d.days))
    : 1;
    const hotPipelines = internships
  .slice()
  .sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0))
  .slice(0, 3)
  .map((internship) => ({
    role: internship.title,
    dept: internship.location || internship.companyId?.name || "",
    apps: internship.applicationsCount || 0,
    velocity: `${Math.max(
      0,
      Math.ceil(
        (new Date(internship.deadline).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    )} Days`,
    status:
      internship.status === "active"
        ? "Active"
        : internship.status === "closed"
        ? "Closed"
        : "Draft",
  }));
  const handleExport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Selected Range", selectedRange],
      ["Total Applicants", String(totalApplicants)],
      ["Active Roles", String(activeRoles)],
      ["Avg Days To Deadline", String(avgDaysToDeadline)],
    ];
    

    const csv = rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recruitment-analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time analytics generated from your recruiter account.</p>
          </div>
          <div className="flex items-center gap-2">
            {["Last 30 Days", "Quarterly", "Yearly"].map((label, i) => (
              <button
                key={label}
                onClick={() => setSelectedRange(label)}
                className={`px-4 py-2 text-sm rounded-lg border transition ${
                  selectedRange === label
                    ? "bg-white border-gray-300 text-gray-800 font-medium shadow-sm"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
            <button onClick={handleExport} className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition ml-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">{card.icon}</div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p
                className={`text-xs font-medium ${
                  card.changeType === "up"
                    ? "text-green-600"
                    : card.changeType === "warn"
                    ? "text-amber-500"
                    : "text-gray-400"
                }`}
              >
                {card.changeType === "up" ? "↑ " : ""}{card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-5 gap-4 mb-6">
          {/* Hiring Velocity Chart */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-gray-900">Hiring Velocity Over Time</h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-blue-300 inline-block" />
                Avg Days to Hire
              </div>
            </div>
            <div className="flex items-end gap-3 h-40">
              {velocityData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-blue-200 hover:bg-blue-400 transition-colors cursor-default"
                    style={{ height: `${(d.days / maxVelocity) * 100}%` }}
                    title={`${d.days} days`}
                  />
                  <span className="text-xs text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applicant Volume by Source */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Applicant Volume by Source</h2>
            <div className="space-y-4">
              {sources.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{s.label}</span>
                    <span className="font-semibold text-gray-900">{s.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${s.color} h-2 rounded-full`}
                      style={{ width: `${(s.count / maxSource) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Insight:</span> University partnerships are driving 42% of total volume, but Referral hires have a 2× higher retention prediction.
              </p>
            </div>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Stage Conversion Rates (Funnel)</h2>
          <div className="flex items-stretch gap-1">
            {funnelStages.map((stage, i) => (
              <div key={stage.label} className="flex items-center gap-1 flex-1 min-w-0">
                <div
                  className={`flex-1 rounded-lg p-4 ${
                    stage.dark ? "bg-blue-700 text-white" : "bg-blue-50 text-gray-900"
                  }`}
                >
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${stage.dark ? "text-blue-200" : "text-gray-500"}`}>
                    {stage.label}
                  </p>
                  <p className={`text-xl font-bold ${stage.dark ? "text-white" : "text-gray-900"}`}>
                    {stage.value.toLocaleString()}
                  </p>
                  <p className={`text-xs mt-1 ${stage.dark ? "text-blue-200" : "text-gray-400"}`}>{stage.sub}</p>
                </div>
                {i < funnelStages.length - 1 && (
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hot Pipelines */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Hot Pipelines</h2>
            <button onClick={() => router.push("/recruiter")} className="text-sm text-blue-600 hover:underline font-medium">View All Roles</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Role Name", "Department", "New Apps", "Avg Velocity", "Status", "Action"].map((col) => (
                  <th key={col} className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide pr-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hotPipelines.map((row) => (
                <tr key={row.role} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 pr-4 text-sm font-medium text-blue-600">{row.role}</td>
                  <td className="py-4 pr-4 text-sm text-gray-600">{row.dept}</td>
                  <td className="py-4 pr-4 text-sm text-gray-900 font-semibold">{row.apps}</td>
                  <td className="py-4 pr-4 text-sm text-gray-600">{row.velocity}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        row.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.status === "Active" ? "bg-green-500" : "bg-amber-500"
                        }`}
                      />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button onClick={() => router.push("/recruiter/interviews")} className="text-sm text-blue-600 hover:underline font-medium">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}