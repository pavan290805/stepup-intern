"use client";

import { useEffect, useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import CompanyTable from "../../../Components/admin/Companies/CompanyTable";
import CompanyDetailsDialog from "../../../Components/admin/Companies/CompanyDetailsDialog";

import type { CompanyApiItem } from "@/lib/api";
import type { Pagination } from "@/types/admin";

interface FetchCompaniesOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export default function CompaniesPage() {
  const {
    getCompanies,
    error,
  } = useAdmin();

  const [companies, setCompanies] =
    useState<CompanyApiItem[]>([]);

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

  const [selectedCompany, setSelectedCompany] =
    useState<CompanyApiItem | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  useEffect(() => {
    fetchCompanies({
      page,
      limit,
      search,
    });
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {

      setPage(1);

      fetchCompanies({
        page: 1,
        limit,
        search,
      });

    }, 500);

    return () => clearTimeout(timer);

  }, [search, limit]);

  async function fetchCompanies({
    page = 1,
    limit = 20,
    search = "",
  }: FetchCompaniesOptions = {}) {
    try {

      setPageLoading(true);

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search.trim()) {
        query.set("search", search.trim());
      }

      const response =
        await getCompanies(query.toString());

      setCompanies(response.companies);
      setPagination(response.pagination);

    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }

  function handleViewCompany(
    company: CompanyApiItem
  ) {
    setSelectedCompany(company);
    setDetailsOpen(true);
  }

  function handleCompanyVerified(companyId: string) {
  setCompanies(prev =>
    prev.filter(company => company._id !== companyId)
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

  function handlePreviousPage() {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }

  function handleNextPage() {
    if (pagination && page < pagination.pages) {
      setPage(prev => prev + 1);
    }
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Companies
          </h1>

          <p className="mt-2 text-gray-500">
            Verify and manage companies.
          </p>

        </div>

        <div className="w-full md:w-80">

          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/20"
          />

        </div>

      </div>

      <CompanyTable
        companies={companies}
        loading={pageLoading}
        error={error}
        onViewCompany={handleViewCompany}
        onCompanyVerified={handleCompanyVerified}
      />

      {pagination && (

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-6">

  <p className="text-gray-600">
    Showing{" "}
    {(page - 1) * limit + 1}
    -
    {Math.min(page * limit, pagination.total)}
    {" "}of{" "}
    {pagination.total}
    {" "}companies
  </p>

  <div className="flex items-center gap-3">

    <span className="text-gray-600">
      Items per page
    </span>

    <select
      value={limit}
      onChange={(e) => setLimit(Number(e.target.value))}
      className="rounded-lg border px-3 py-2"
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
      <option value={pagination.total}>
        All ({pagination.total})
      </option>
    </select>

  </div>

</div>

          <div className="flex items-center gap-3">

            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </p>

            <button
              onClick={handleNextPage}
              disabled={page === pagination.pages}
              className="rounded-lg border px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      )}

      <CompanyDetailsDialog
        open={detailsOpen}
        company={selectedCompany}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedCompany(null);
        }}
      />

    </div>
  );
}