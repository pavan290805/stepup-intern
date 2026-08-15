"use client";

import type { CompanyApiItem } from "@/lib/api";

import CompanyActions from "./CompanyActions";

interface Props {
  company: CompanyApiItem;

  onViewCompany: (company: CompanyApiItem) => void;

  onCompanyVerified: (companyId: string) => void;
}

export default function CompanyRow({
  company,
  onViewCompany,
  onCompanyVerified,
}: Props) {
  return (
    <tr className="border-b">

      <td className="px-6 py-4 font-medium">
        {company.name}
      </td>

      <td className="px-6 py-4">
        {company.industry}
      </td>

      <td className="px-6 py-4">
        {company.headquarters}
      </td>

      <td className="px-6 py-4">

        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0880EF] hover:underline"
        >
          Visit Website
        </a>

      </td>

      <td className="px-6 py-4">

        <span
          className={`rounded-full px-3 py-1 text-sm ${
            company.verificationStatus === "verified"
              ? "bg-green-100 text-green-600"
              : company.verificationStatus === "rejected"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {company.verificationStatus}
        </span>

      </td>

      <td className="px-6 py-4">

        <CompanyActions
          company={company}
          onViewCompany={onViewCompany}
          onCompanyVerified={onCompanyVerified}
        />

      </td>

    </tr>
  );
}