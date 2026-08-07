"use client";

import type { CompanyApiItem } from "@/lib/api";

interface Props {
  open: boolean;
  company: CompanyApiItem | null;
  onClose: () => void;
}

export default function CompanyDetailsDialog({
  open,
  company,
  onClose,
}: Props) {
  if (!open || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-2xl font-bold text-gray-900">
            Company Details
          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none text-gray-500 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* Company */}

        <div className="flex items-center gap-4 border-b px-6 py-5">

          {company.logoUrl ? (

            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-16 w-16 rounded-full border object-cover"
            />

          ) : (

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0880EF] text-2xl font-semibold text-white">

              {company.name.charAt(0).toUpperCase()}

            </div>

          )}

          <div>

            <h3 className="text-xl font-semibold text-gray-900">
              {company.name}
            </h3>

            <p className="text-gray-500">
              {company.industry}
            </p>

          </div>

        </div>

        {/* Details */}

        <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-6 py-6">

          <div>

            <p className="text-sm text-gray-500">
              Company Size
            </p>

            <p className="mt-1 font-medium">
              {company.companySize}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Headquarters
            </p>

            <p className="mt-1 font-medium">
              {company.headquarters}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Industry
            </p>

            <p className="mt-1 font-medium">
              {company.industry}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Verification
            </p>

            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                company.verificationStatus === "verified"
                  ? "bg-green-100 text-green-700"
                  : company.verificationStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {company.verificationStatus}
            </span>

          </div>

          <div className="col-span-2">

            <p className="text-sm text-gray-500">
              Website
            </p>

            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-[#0880EF] hover:underline"
            >
              {company.website}
            </a>

          </div>

          <div className="col-span-2">

            <p className="text-sm text-gray-500">
              Description
            </p>

            <p className="mt-1 whitespace-pre-wrap font-medium">
              {company.description}
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-lg bg-[#0880EF] px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}