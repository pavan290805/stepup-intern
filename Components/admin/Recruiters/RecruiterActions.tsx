"use client";

import { useAdmin } from "@/hooks/useAdmin";
import type { RecruiterProfileApi } from "@/lib/api";

interface Props {
  recruiter: RecruiterProfileApi;
}

export default function RecruiterActions({
  recruiter,
}: Props) {
  const { verifyRecruiter } = useAdmin();

  async function handleVerify() {
    if (!recruiter._id) return;

    try {
      await verifyRecruiter(recruiter._id, {
        action: "verify",
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReject() {
    if (!recruiter._id) return;

    try {
      await verifyRecruiter(recruiter._id, {
        action: "reject",
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center gap-3">

      <button
        onClick={handleVerify}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
      >
        Verify
      </button>

      <button
        onClick={handleReject}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
      >
        Reject
      </button>

    </div>
  );
}