"use client";

import { BriefcaseBusiness } from "lucide-react";

import InternshipRow from "./InternshipRow";

import type { InternshipApiItem } from "@/lib/api";
import type { Pagination } from "@/types/admin";

interface Props {
  internships: InternshipApiItem[];
  loading: boolean;
  error: string | null;

  pagination: Pagination | null;

  page: number;

  limit: number;

  onPageChange: (page: number) => void;

  onLimitChange: (limit: number) => void;

  onStatusUpdated: (
    internship: InternshipApiItem
  ) => void;

  onInternshipDeleted: (
    internshipId: string
  ) => void;
}

export default function InternshipTable({
  internships,
  loading,
  error,
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onStatusUpdated,
  onInternshipDeleted,
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

  if (internships.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

          <BriefcaseBusiness className="h-8 w-8 text-[#0880EF]" />

        </div>

        <h3 className="mt-5 text-xl font-semibold text-gray-900">
          No Internships Found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          There are no internships to display.
        </p>

      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-[#0880EF] text-white">

            <tr>

              <th className="px-6 py-4 text-left">
                Title
              </th>

              <th className="px-6 py-4 text-left">
                Company
              </th>

              <th className="px-6 py-4 text-left">
                Location
              </th>

              <th className="px-6 py-4 text-left">
                Stipend
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {internships.map((internship) => (
              <InternshipRow
                key={internship._id}
                internship={internship}
                onStatusUpdated={onStatusUpdated}
                onInternshipDeleted={onInternshipDeleted}
              />
            ))}

          </tbody>

        </table>

      </div>

      {pagination && (
        <div className="mt-6 flex items-center justify-between">

          <div className="flex items-center gap-6">

            <p className="text-gray-600">
              Showing{" "}
              {(page - 1) * limit + 1}
              -
              {Math.min(
                page * limit,
                pagination.total
              )}{" "}
              of {pagination.total} internships
            </p>

            <div className="flex items-center gap-3">

              <span className="text-gray-600">
                Items per page
              </span>

              <select
                value={limit}
                onChange={(e) =>
                  onLimitChange(
                    Number(e.target.value)
                  )
                }
                className="rounded-lg border px-3 py-2"
              >
                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={50}>
                  50
                </option>

                <option value={100}>
                  100
                </option>

                <option value={pagination.total}>
                  All ({pagination.total})
                </option>

              </select>

            </div>

          </div>

          <div className="flex items-center gap-5">

            <button
              onClick={() =>
                onPageChange(page - 1)
              }
              disabled={page === 1}
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-gray-600">
              Page {pagination.page} of{" "}
              {pagination.pages}
            </p>

            <button
              onClick={() =>
                onPageChange(page + 1)
              }
              disabled={
                page === pagination.pages
              }
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      )}
    </>
  );
}