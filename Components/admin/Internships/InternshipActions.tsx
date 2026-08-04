"use client";

import { useAdmin } from "@/hooks/useAdmin";

import type { InternshipApiItem } from "@/lib/api";

interface Props {
  internship: InternshipApiItem;
}

export default function InternshipActions({
  internship,
}: Props) {

  const {
    updateInternshipStatus,
    deleteInternship,
  } = useAdmin();

  async function handleStatus() {
    const nextStatus =
      internship.status === "active"
        ? "closed"
        : "active";

    try {

      await updateInternshipStatus(
        internship._id,
        {
          status: nextStatus,
        }
      );

      window.location.reload();

    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    try {

      await deleteInternship(
        internship._id
      );

      window.location.reload();

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center gap-3">

      <button
        onClick={handleStatus}
        className="rounded-lg bg-[#0880EF] px-4 py-2 text-sm text-white"
      >
        {internship.status === "active"
          ? "Close"
          : "Activate"}
      </button>

      <button
        onClick={handleDelete}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
      >
        Delete
      </button>

    </div>
  );
}