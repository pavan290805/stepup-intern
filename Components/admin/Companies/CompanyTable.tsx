"use client";

import type { CompanyApiItem } from "@/lib/api";

import CompanyRow from "./CompanyRow";

interface Props {
  companies: CompanyApiItem[];
  loading: boolean;
  error: string | null;
}

export default function CompanyTable({
  companies,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading...
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
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}