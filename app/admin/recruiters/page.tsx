"use client";

import { useEffect, useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import RecruiterTable from "../../../Components/admin/Recruiters/RecruiterTable";

import type { RecruiterProfileApi } from "@/lib/api";

export default function RecruitersPage() {
  const {
    getRecruiters,
    loading,
    error,
  } = useAdmin();

  const [recruiters, setRecruiters] =
    useState<RecruiterProfileApi[]>([]);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  async function fetchRecruiters() {
    try {
      const response = await getRecruiters();

      setRecruiters(response.recruiters);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Recruiters
        </h1>

        <p className="mt-2 text-gray-500">
          Verify recruiter accounts.
        </p>

      </div>

      <RecruiterTable
        recruiters={recruiters}
        loading={loading}
        error={error}
      />

    </div>
  );
}