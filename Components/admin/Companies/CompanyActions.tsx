"use client";

import type { CompanyApiItem } from "@/lib/api";

import { useAdmin } from "@/hooks/useAdmin";

interface Props {
  company: CompanyApiItem;
}

export default function CompanyActions({
  company,
}: Props) {
  const {
    verifyCompany,
  } = useAdmin();

  async function handleVerify() {
    try {

      await verifyCompany(company._id, {
        action: "verify",
      });

      window.location.reload();

    } catch (err) {
      console.error(err);
    }
  }

  async function handleReject() {
    try {

      await verifyCompany(company._id, {
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