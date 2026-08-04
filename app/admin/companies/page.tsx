"use client";

import { useEffect, useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import CompanyTable from "../../../Components/admin/Companies/CompanyTable";

import type { CompanyApiItem } from "@/lib/api";

export default function CompaniesPage() {
  const {
    getCompanies,
    loading,
    error,
  } = useAdmin();

  const [companies, setCompanies] =
    useState<CompanyApiItem[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      const response =
        await getCompanies();

      setCompanies(response.companies);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Companies
        </h1>

        <p className="mt-2 text-gray-500">
          Verify and manage companies.
        </p>

      </div>

      <CompanyTable
        companies={companies}
        loading={loading}
        error={error}
      />

    </div>
  );
}