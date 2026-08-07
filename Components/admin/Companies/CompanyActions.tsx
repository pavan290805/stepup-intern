"use client";

import { useState } from "react";

import { toast } from "sonner";

import type { CompanyApiItem } from "@/lib/api";

import { useAdmin } from "@/hooks/useAdmin";

interface Props {
  company: CompanyApiItem;

  onViewCompany: (company: CompanyApiItem) => void;

  onCompanyVerified: (companyId: string) => void;
}

export default function CompanyActions({
  company,
  onViewCompany,
  onCompanyVerified,
}: Props) {
  const {
    verifyCompany,
  } = useAdmin();

  const [loading, setLoading] =
    useState(false);

  async function handleVerify() {
    try {
      setLoading(true);

      await verifyCompany(company._id, {
        action: "verify",
      });

      toast.success(
        `${company.name} verified successfully`
      );

      onCompanyVerified(company._id);

    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to verify company"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    try {
      setLoading(true);

      await verifyCompany(company._id, {
        action: "reject",
      });

      toast.success(
        `${company.name} rejected successfully`
      );

      onCompanyVerified(company._id);

    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to reject company"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center gap-3">

      <button
        onClick={() => onViewCompany(company)}
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
  );
}