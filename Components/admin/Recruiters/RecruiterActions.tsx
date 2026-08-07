"use client";

import { useState } from "react";

import { toast } from "sonner";

import { useAdmin } from "@/hooks/useAdmin";

import RecruiterDetailsDialog from "./RecruiterDetailsDialog";

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

export default function RecruiterActions({
  recruiter,
  onRecruiterUpdated,
  onRecruiterRemoved,
}: Props) {
  const {
    verifyRecruiter,
  } = useAdmin();

  const [loading, setLoading] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  async function handleVerify() {
    try {
      setLoading(true);

      await verifyRecruiter(
        recruiter._id,
        {
          action: "verify",
        }
      );

      toast.success(
        "Recruiter verified successfully"
      );

      onRecruiterRemoved(
        recruiter._id
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to verify recruiter"
      );

    } finally {

      setLoading(false);

    }
  }

  async function handleReject() {
    try {

      setLoading(true);

      await verifyRecruiter(
        recruiter._id,
        {
          action: "reject",
        }
      );

      toast.success(
        "Recruiter rejected successfully"
      );

      onRecruiterRemoved(
        recruiter._id
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to reject recruiter"
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
          onClick={handleVerify}
          disabled={loading}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Verify
        </button>

        <button
          onClick={handleReject}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Reject
        </button>

      </div>

      <RecruiterDetailsDialog
        open={detailsOpen}
        recruiter={recruiter}
        onClose={() =>
          setDetailsOpen(false)
        }
      />
    </>
  );
}