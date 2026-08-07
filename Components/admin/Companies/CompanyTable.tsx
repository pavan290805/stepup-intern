"use client";

import { Building2 } from "lucide-react";

import type { CompanyApiItem } from "@/lib/api";

import CompanyRow from "./CompanyRow";

interface Props {
  companies: CompanyApiItem[];
  loading: boolean;
  error: string | null;

  onViewCompany: (company: CompanyApiItem) => void;

  onCompanyVerified: (companyId: string) => void;
}

export default function CompanyTable({
  companies,
  loading,
  error,
  onViewCompany,
  onCompanyVerified,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading companies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-600">
        {error}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <Building2 className="h-8 w-8 text-[#0880EF]" />
        </div>

        <h3 className="mt-5 text-xl font-semibold text-gray-900">
          No Pending Companies
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          There are no companies awaiting verification.
        </p>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">

      <table className="w-full">

        <thead className="bg-[#0880EF] text-white">

          <tr>

            <th className="px-6 py-4 text-left">
              Company
            </th>

            <th className="px-6 py-4 text-left">
              Industry
            </th>

            <th className="px-6 py-4 text-left">
              Headquarters
            </th>

            <th className="px-6 py-4 text-left">
              Website
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {companies.map((company) => (
            <CompanyRow
              key={company._id}
              company={company}
              onViewCompany={onViewCompany}
              onCompanyVerified={onCompanyVerified}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}