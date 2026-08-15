"use client";

import { useState } from "react";

import { toast } from "sonner";

import { useAdmin } from "@/hooks/useAdmin";

import InternshipDetailsDialog from "./InternshipDetailsDialog";

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

export default function InternshipActions({
  internship,
  onStatusUpdated,
  onInternshipDeleted,
}: Props) {

  const {
    updateInternshipStatus,
    deleteInternship,
  } = useAdmin();

  const [loading, setLoading] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  async function handleStatus() {

    const nextStatus =
      internship.status === "active"
        ? "closed"
        : "active";

    try {

      setLoading(true);

      await updateInternshipStatus(
        internship._id,
        {
          status: nextStatus,
        }
      );

      toast.success(
        `Internship ${nextStatus} successfully`
      );

      onStatusUpdated({
        ...internship,
        status: nextStatus,
      });

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to update internship"
      );

    } finally {

      setLoading(false);

    }

  }

  async function handleDelete() {

    try {

      setLoading(true);

      await deleteInternship(
        internship._id
      );

      toast.success(
        "Internship deleted successfully"
      );

      onInternshipDeleted(
        internship._id
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to delete internship"
      );

    } finally {

      setLoading(false);

    }

  }

  return (
    <>
      <div className="flex justify-center gap-3">

        <button
          onClick={() =>
            setDetailsOpen(true)
          }
          className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          View
        </button>

        <button
          onClick={handleStatus}
          disabled={loading}
          className="rounded-lg bg-[#0880EF] px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {internship.status === "active"
            ? "Close"
            : "Activate"}
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Delete
        </button>

      </div>

      <InternshipDetailsDialog
        open={detailsOpen}
        internship={internship}
        onClose={() =>
          setDetailsOpen(false)
        }
      />

    </>
  );
}