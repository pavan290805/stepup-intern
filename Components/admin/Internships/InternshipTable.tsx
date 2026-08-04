"use client";

import type { InternshipApiItem } from "@/lib/api";

import InternshipRow from "./InternshipRow";

interface Props {
  internships: InternshipApiItem[];
  loading: boolean;
  error: string | null;
}

export default function InternshipTable({
  internships,
  loading,
  error,
}: Props) {

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading internships...
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
            <th className="px-6 py-4 text-left">Title</th>
            <th className="px-6 py-4 text-left">Company</th>
            <th className="px-6 py-4 text-left">Location</th>
            <th className="px-6 py-4 text-left">Stipend</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>

        </thead>

        <tbody>

          {internships.map((internship) => (
            <InternshipRow
              key={internship._id}
              internship={internship}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}