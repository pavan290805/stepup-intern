"use client";

import type { RecruiterProfileApi } from "@/lib/api";
import RecruiterActions from "./RecruiterActions";

interface Props {
  recruiter: RecruiterProfileApi;
}

export default function RecruiterRow({
  recruiter,
}: Props) {
  const recruiterName =
    typeof recruiter.userId === "object"
      ? recruiter.userId?.name
      : "-";

  const companyName =
    typeof recruiter.companyId === "object"
      ? recruiter.companyId?.name
      : "-";

  return (
    <tr className="border-b">

      <td className="px-6 py-4">
        {recruiterName ?? "-"}
      </td>

      <td className="px-6 py-4">
        {companyName ?? "-"}
      </td>

      <td className="px-6 py-4">
        {recruiter.designation ?? "-"}
      </td>

      <td className="px-6 py-4">
        {recruiter.phoneNumber ?? "-"}
      </td>

      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            recruiter.verificationStatus === "verified"
              ? "bg-green-100 text-green-600"
              : recruiter.verificationStatus === "rejected"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {recruiter.verificationStatus ?? "pending"}
        </span>
      </td>

      <td className="px-6 py-4">
        <RecruiterActions recruiter={recruiter} />
      </td>

    </tr>
  );
}