"use client";

import type { InternshipApiItem } from "@/lib/api";

interface Props {
  open: boolean;
  internship: InternshipApiItem | null;
  onClose: () => void;
}

export default function InternshipDetailsDialog({
  open,
  internship,
  onClose,
}: Props) {
  if (!open || !internship) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-2xl font-bold text-gray-900">
            Internship Details
          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none text-gray-500 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-6 py-6">

          <div>
            <p className="text-sm text-gray-500">
              Title
            </p>

            <p className="mt-1 font-medium">
              {internship.title}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Company
            </p>

            <p className="mt-1 font-medium">
              {internship.companyId?.name ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Location
            </p>

            <p className="mt-1 font-medium">
              {internship.location}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Work Mode
            </p>

            <p className="mt-1 font-medium">
              {internship.workMode}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Stipend
            </p>

            <p className="mt-1 font-medium">
              ₹{internship.stipend}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Duration
            </p>

            <p className="mt-1 font-medium">
              {internship.duration}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Openings
            </p>

            <p className="mt-1 font-medium">
              {internship.openings}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Deadline
            </p>

            <p className="mt-1 font-medium">
              {internship.deadline
                ? new Date(internship.deadline).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div className="col-span-2">

            <p className="text-sm text-gray-500">
              Skills Required
            </p>

            <div className="mt-2 flex flex-wrap gap-2">

              {internship.skillsRequired?.length ? (
                internship.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-[#0880EF]"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span>-</span>
              )}

            </div>

          </div>

          <div className="col-span-2">

            <p className="text-sm text-gray-500">
              Description
            </p>

            <p className="mt-1 whitespace-pre-wrap leading-7">
              {internship.description}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Status
            </p>

            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                internship.status === "active"
                  ? "bg-green-100 text-green-700"
                  : internship.status === "closed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {internship.status}
            </span>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Created At
            </p>

            <p className="mt-1 font-medium">
              {internship.createdAt
                ? new Date(
                    internship.createdAt
                  ).toLocaleDateString()
                : "-"}
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