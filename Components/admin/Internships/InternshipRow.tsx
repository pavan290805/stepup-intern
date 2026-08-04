"use client";

import type { InternshipApiItem } from "@/lib/api";

import InternshipActions from "./InternshipActions";

interface Props {
  internship: InternshipApiItem;
}

export default function InternshipRow({
  internship,
}: Props) {

  return (
    <tr className="border-b">

      <td className="px-6 py-4">
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
        />

      </td>

    </tr>
  );
}