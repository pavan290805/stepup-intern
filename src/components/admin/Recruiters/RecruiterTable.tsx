"use client";

import { UserCheck } from "lucide-react";

import RecruiterRow from "./RecruiterRow";

import type { RecruiterProfileApi } from "@/lib/api";

interface Props {
  recruiters: RecruiterProfileApi[];
  loading: boolean;
  error: string | null;

  onRecruiterUpdated: (
    recruiter: RecruiterProfileApi
  ) => void;

  onRecruiterRemoved: (
    recruiterId: string
  ) => void;
}

export default function RecruiterTable({
  recruiters,
  loading,
  error,
  onRecruiterUpdated,
  onRecruiterRemoved,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading recruiters...
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

  if (recruiters.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

          <UserCheck className="h-8 w-8 text-[#0880EF]" />

        </div>

        <h3 className="mt-5 text-xl font-semibold text-gray-900">
          No Recruiters Found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          There are no recruiters to display.
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
              Recruiter
            </th>

            <th className="px-6 py-4 text-left">
              Company
            </th>

            <th className="px-6 py-4 text-left">
              Designation
            </th>

            <th className="px-6 py-4 text-left">
              Phone
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

          {recruiters.map((recruiter) => (
            <RecruiterRow
              key={recruiter._id}
              recruiter={recruiter}
              onRecruiterUpdated={
                onRecruiterUpdated
              }
              onRecruiterRemoved={
                onRecruiterRemoved
              }
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}