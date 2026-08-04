"use client";

import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";

import DashboardGrid from "../../Components/admin/Dashboard/DashboardGrid";

export default function AdminDashboard() {
  const {
    statistics,
    loading,
    error,
    loadStatistics,
  } = useAdmin();

  useEffect(() => {
    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-lg font-semibold text-[#0880EF]">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#0880EF] bg-white p-6">
        <p className="text-[#000000]">
          {error}
        </p>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#000000]">
          Dashboard
        </h1>

        <p className="mt-2 text-[#000000]/70">
          Welcome to the StepUpIntern Admin Dashboard.
        </p>
      </div>

      <DashboardGrid statistics={statistics} />
    </div>
  );
}