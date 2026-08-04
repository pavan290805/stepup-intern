"use client";

import type { RecruiterProfileApi } from "@/lib/api";
import RecruiterRow from "./RecruiterRow";

interface Props {
  recruiters: RecruiterProfileApi[];
  loading: boolean;
  error: string | null;
}

export default function RecruiterTable({
  recruiters,
  loading,
  error,
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

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-[#0880EF] text-white">
          <tr>
            <th className="px-6 py-4 text-left">Recruiter</th>
            <th className="px-6 py-4 text-left">Company</th>
            <th className="px-6 py-4 text-left">Designation</th>
            <th className="px-6 py-4 text-left">Phone</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {recruiters.map((recruiter, index) => (
            <RecruiterRow
              key={recruiter._id ?? index}
              recruiter={recruiter}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}