"use client";

import type {
  RecruiterProfileApi,
} from "@/lib/api";

interface Props {
  open: boolean;
  recruiter: RecruiterProfileApi | null;
  onClose: () => void;
}

export default function RecruiterDetailsDialog({
  open,
  recruiter,
  onClose,
}: Props) {
  if (!open || !recruiter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-2xl font-bold text-gray-900">
            Recruiter Details
          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none text-gray-500 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* Profile */}

        <div className="flex items-center gap-4 border-b px-6 py-5">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0880EF] text-2xl font-semibold text-white">

            {
  typeof recruiter.userId === "object"
    ? recruiter.userId?.name?.charAt(0).toUpperCase()
    : "R"
}

          </div>

          <div>

            <h3 className="text-xl font-semibold text-gray-900">
              {
            typeof recruiter.userId === "object"
            ? recruiter.userId?.name
            : "-"
            }
            </h3>

            <p className="text-gray-500">
              {
  typeof recruiter.userId === "object"
    ? recruiter.userId?.email
    : "-"
}
            </p>

          </div>

        </div>

        {/* Details */}

        <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-6 py-6">

          <div>

            <p className="text-sm text-gray-500">
              Company
            </p>

            <p className="mt-1 font-medium">
              {
  typeof recruiter.companyId === "object"
    ? recruiter.companyId?.name
    : "-"
}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Designation
            </p>

            <p className="mt-1 font-medium">
              {recruiter.designation}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Phone Number
            </p>

            <p className="mt-1 font-medium">
              {recruiter.phoneNumber}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Verification Status
            </p>

            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                recruiter.verificationStatus === "verified"
                  ? "bg-green-100 text-green-700"
                  : recruiter.verificationStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {recruiter.verificationStatus}
            </span>

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