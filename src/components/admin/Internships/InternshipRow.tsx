"use client";

import InternshipActions from "./InternshipActions";

import type { InternshipApiItem } from "@/lib/api";

interface Props {
  internship: InternshipApiItem;

  onStatusUpdated: (
    internship: InternshipApiItem
  ) => void;

  onInternshipDeleted: (
    internshipId: string
  ) => void;
}

export default function InternshipRow({
  internship,
  onStatusUpdated,
  onInternshipDeleted,
}: Props) {
  return (
    <tr className="border-b">

      <td className="px-6 py-4 font-medium">
        {internship.title}
      </td>

      <td className="px-6 py-4">
        {internship.companyId?.name ?? "-"}
      </td>

      <td className="px-6 py-4">
        {internship.location}
      </td>

      <td className="px-6 py-4">
        ₹{internship.stipend}
      </td>

      <td className="px-6 py-4">

        <span
          className={`rounded-full px-3 py-1 text-sm ${
            internship.status === "active"
              ? "bg-green-100 text-green-600"
              : internship.status === "closed"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {internship.status}
        </span>

      </td>

      <td className="px-6 py-4">

        <InternshipActions
          internship={internship}
          onStatusUpdated={onStatusUpdated}
          onInternshipDeleted={onInternshipDeleted}
        />

      </td>

    </tr>
  );
}