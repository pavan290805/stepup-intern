"use client";

import { useEffect, useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import InternshipTable from "../../../Components/admin/Internships/InternshipTable";

import type { InternshipApiItem } from "@/lib/api";

export default function InternshipsPage() {
  const {
    getInternships,
    loading,
    error,
  } = useAdmin();

  const [internships, setInternships] =
    useState<InternshipApiItem[]>([]);

  useEffect(() => {
    fetchInternships();
  }, []);

  async function fetchInternships() {
    try {
      const response = await getInternships();

      setInternships(response.internships);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Internships
        </h1>

        <p className="mt-2 text-gray-500">
          Manage internships.
        </p>
      </div>

      <InternshipTable
        internships={internships}
        loading={loading}
        error={error}
      />

    </div>
  );
}