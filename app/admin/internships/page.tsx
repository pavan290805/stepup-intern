"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import InternshipTable from "../@/components/admin/Internships/InternshipTable";

import type { InternshipApiItem } from "@/lib/api";
import type { Pagination } from "@/types/admin";

interface FetchInternshipsOptions {
    page?: number;
    limit?: number;
    search?: string;
}

export default function InternshipsPage() {
  const {
    getInternships,
    loading,
    error,
  } = useAdmin();

  const [internships, setInternships] =
    useState<InternshipApiItem[]>([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [search, setSearch] = useState("");

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const fetchInternships = useCallback(async ({
    page = 1,
    limit = 20,
    search = "",
  }: FetchInternshipsOptions = {}) => {
    try {
      const query = `page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const response = await getInternships(query);

      setInternships(response.internships);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
    }
  }, [getInternships]);

  useEffect(() => {
    void fetchInternships({
      page,
      limit,
      search,
    });
  }, [fetchInternships, page, limit, search]);

  useEffect(() => {

    const timer = setTimeout(() => {

        setPage(1);

        void fetchInternships({
            page: 1,
            limit,
            search,
        });

    }, 500);

    return () => clearTimeout(timer);

}, [fetchInternships, search, limit]);

  function handleStatusUpdated(
    updatedInternship: InternshipApiItem
  ) {
    setInternships(prev =>
      prev.map(internship =>
        internship._id === updatedInternship._id
          ? updatedInternship
          : internship
      )
    );
  }

  function handleInternshipDeleted(
    internshipId: string
  ) {
    setInternships(prev =>
      prev.filter(
        internship => internship._id !== internshipId
      )
    );

    setPagination(prev =>
      prev
        ? {
            ...prev,
            total: prev.total - 1,
          }
        : prev
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex items-end justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Internships
          </h1>

          <p className="mt-2 text-gray-500">
            Manage internships.
          </p>

        </div>

        <input
          type="text"
          value={search}
          placeholder="Search by title, location or status..."
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-80 rounded-lg border px-4 py-2"
        />

      </div>

      <InternshipTable
        internships={internships}
        loading={loading}
        error={error}
        pagination={pagination}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        onStatusUpdated={handleStatusUpdated}
        onInternshipDeleted={handleInternshipDeleted}
      />

    </div>
  );
}
