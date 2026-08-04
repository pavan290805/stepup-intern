"use client";

import StatsCard from "./StatsCard";

import type { AdminStatistics } from "@/types/admin";

interface DashboardGridProps {
  statistics: AdminStatistics;
}

export default function DashboardGrid({
  statistics,
}: DashboardGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <StatsCard
        title="Total Users"
        value={statistics.totalUsers}
      />

      <StatsCard
        title="Total Companies"
        value={statistics.totalCompanies}
      />

      <StatsCard
        title="Total Internships"
        value={statistics.totalInternships}
      />

      <StatsCard
        title="Total Applications"
        value={statistics.totalApplications}
      />

      <StatsCard
        title="Students"
        value={statistics.studentCount}
      />

      <StatsCard
        title="Recruiters"
        value={statistics.recruiterCount}
      />
    </div>
  );
}