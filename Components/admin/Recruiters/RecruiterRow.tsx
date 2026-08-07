"use client";

import RecruiterActions from "./RecruiterActions";

import type {
  RecruiterProfileApi,
} from "@/lib/api";

interface Props {
  recruiter: RecruiterProfileApi;

  onRecruiterUpdated: (
    recruiter: RecruiterProfileApi
  ) => void;

  onRecruiterRemoved: (
    recruiterId: string
  ) => void;
}

export default function RecruiterRow({
  recruiter,
  onRecruiterUpdated,
  onRecruiterRemoved,
}: Props) {
  return (
    <tr className="border-b">

      <td className="px-6 py-4 font-medium">
        {
            typeof recruiter.userId === "object"
            ? recruiter.userId?.name
            : "-"
            }
      </td>

      <td className="px-6 py-4">
        {
  typeof recruiter.companyId === "object"
    ? recruiter.companyId?.name
    : "-"
}
      </td>

      <td className="px-6 py-4">
        {recruiter.designation}
      </td>

      <td className="px-6 py-4">
        {recruiter.phoneNumber}
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
          {recruiter.verificationStatus}
        </span>

      </td>

      <td className="px-6 py-4">

        <RecruiterActions
          recruiter={recruiter}
          onRecruiterUpdated={onRecruiterUpdated}
          onRecruiterRemoved={onRecruiterRemoved}
        />

      </td>

    </tr>
  );
}