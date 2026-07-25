"use client";

import { useEffect } from "react";
import { useAdmin } from "../../src/hooks/useAdmin";

export default function AdminDashboard() {
  const {
    statistics,
    loading,
    error,
    loadStatistics,
  } = useAdmin();

  useEffect(() => {
    loadStatistics();
  }, []);

  if (loading) {
    return (
      <div className="text-lg font-semibold">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">
            Total Users
          </h2>

          <p className="mt-2 text-4xl font-bold text-blue-600">
            {statistics?.totalUsers ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">
            Total Companies
          </h2>

          <p className="mt-2 text-4xl font-bold text-green-600">
            {statistics?.totalCompanies ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">
            Total Internships
          </h2>

          <p className="mt-2 text-4xl font-bold text-purple-600">
            {statistics?.totalInternships ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">
            Total Applications
          </h2>

          <p className="mt-2 text-4xl font-bold text-orange-600">
            {statistics?.totalApplications ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">
            Students
          </h2>

          <p className="mt-2 text-4xl font-bold text-cyan-600">
            {statistics?.studentCount ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">
            Recruiters
          </h2>

          <p className="mt-2 text-4xl font-bold text-pink-600">
            {statistics?.recruiterCount ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}