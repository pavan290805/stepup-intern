"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import RecruiterTable from "../@/components/admin/Recruiters/RecruiterTable";

import type {
  RecruiterProfileApi,
} from "@/lib/api";

import type {
  Pagination,
} from "@/types/admin";

interface FetchRecruitersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export default function RecruitersPage() {
  const {
    getRecruiters,
    loading,
    error,
  } = useAdmin();

  const [recruiters, setRecruiters] =
    useState<RecruiterProfileApi[]>([]);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(20);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const fetchRecruiters = useCallback(async ({
    page = 1,
    limit = 20,
    search = "",
  }: FetchRecruitersOptions = {}) => {
    try {
      setPageLoading(true);

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search.trim()) {
        query.set("search", search.trim());
      }

      const response = await getRecruiters(query.toString());

      setRecruiters(response.recruiters);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }, [getRecruiters]);

  function handleRecruiterUpdated(
    updatedRecruiter: RecruiterProfileApi
  ) {
    setRecruiters((prev) =>
      prev.map((recruiter) =>
        recruiter._id === updatedRecruiter._id
          ? updatedRecruiter
          : recruiter
      )
    );
  }

  function handleRecruiterRemoved(
    recruiterId: string
  ) {
    setRecruiters((prev) =>
      prev.filter(
        (recruiter) =>
          recruiter._id !== recruiterId
      )
    );

    setPagination((prev) =>
      prev
        ? {
            ...prev,
            total: prev.total - 1,
          }
        : prev
    );
  }

  function handlePreviousPage() {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  function handleNextPage() {
    if (
      pagination &&
      page < pagination.pages
    ) {
      setPage((prev) => prev + 1);
    }
  }

  useEffect(() => {
    void fetchRecruiters({
      page,
      limit,
      search,
    });
  }, [fetchRecruiters, page, limit, search]);

  useEffect(() => {
    const timer = setTimeout(() => {

      setPage(1);

      void fetchRecruiters({
        page: 1,
        limit,
        search,
      });

    }, 500);

    return () =>
      clearTimeout(timer);

  }, [fetchRecruiters, search, limit]);

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-black">
            Recruiters
          </h1>

          <p className="mt-2 text-black/70">
            Verify recruiter accounts.
          </p>

        </div>

        <div className="w-full md:w-80">

          <input
            type="text"
            placeholder="Search designation or phone..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/20"
          />

        </div>

      </div>

      <RecruiterTable
        recruiters={recruiters}
        loading={pageLoading}
        error={error}
        onRecruiterUpdated={
          handleRecruiterUpdated
        }
        onRecruiterRemoved={
          handleRecruiterRemoved
        }
      />

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
              of {pagination.total} recruiters
            </p>

            <div className="flex items-center gap-3">

              <span className="text-gray-600">
                Items per page
              </span>

              <select
                value={limit}
                onChange={(e) =>
                  setLimit(
                    Number(
                      e.target.value
                    )
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

                <option
                  value={
                    pagination.total
                  }
                >
                  All (
                  {pagination.total}
                  )
                </option>

              </select>

            </div>

          </div>

          <div className="flex items-center gap-5">

            <button
              onClick={
                handlePreviousPage
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
              onClick={
                handleNextPage
              }
              disabled={
                page ===
                pagination.pages
              }
              className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
