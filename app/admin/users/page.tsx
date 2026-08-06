"use client";

import { useEffect, useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import UserTable from "../../../Components/admin/Users/UserTable";

import type { AdminUser, Pagination } from "@/types/admin";

interface FetchUsersOptions {
    page?: number;
    limit?: number;
    search?: string;
}

export default function UsersPage() {
  const { getUsers, loading, error } = useAdmin();

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [pageLoading, setPageLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  function handleStatusUpdated(updatedUser: AdminUser) {
    setUsers(prev =>
      prev.map(user =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
  }

  function handleUserDeleted(userId: string) {
    setUsers(prev => prev.filter(user => user._id !== userId));
  }
  function handlePreviousPage() {
    if (page > 1) {
        setPage((prev) => prev - 1);
    }
}

function handleNextPage() {
    if (pagination && page < pagination.pages) {
        setPage((prev) => prev + 1);
    }
}
function handleLimitChange(
    event: React.ChangeEvent<HTMLSelectElement>
) {
    const newLimit = Number(event.target.value);

    setLimit(newLimit);

    setPage(1);
}
function getShowingText() {
    if (!pagination) return "";

    const start =
        (pagination.page - 1) * pagination.limit + 1;

    const end = Math.min(
        pagination.page * pagination.limit,
        pagination.total
    );

    return `Showing ${start}-${end} of ${pagination.total} users`;
}

  useEffect(() => {
    fetchUsers({
      page,
      limit,
      search:debouncedSearch,
    });
  }, [page,limit,debouncedSearch]);

  useEffect(() => {

    const timer = setTimeout(() => {

        setDebouncedSearch(search.trim());

        setPage(1);

    }, 500);

    return () => clearTimeout(timer);

}, [search]);

  async function fetchUsers({
    page = 1,
    limit = 20,
    search = "",  
  }: FetchUsersOptions = {}) {
    try {
      setPageLoading(true);

        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search.trim()) {
            query.set("search", search.trim());
        }

        const response = await getUsers(query.toString());

        setUsers(response.users);
        setPagination(response.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>
        <h1 className="text-3xl font-bold text-black">
            Users
        </h1>

        <p className="mt-2 text-black/70">
            Manage all registered users.
        </p>
    </div>

    <div className="w-full md:w-80">

        <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all focus:border-[#0880EF] focus:ring-2 focus:ring-[#0880EF]/20"
        />

    </div>

</div>

      <UserTable
        users={users}
        loading={pageLoading}
        error={error}
        onStatusUpdated={handleStatusUpdated}
        onUserDeleted={handleUserDeleted}
      />
      {pagination && (
        
    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">
             <p className="text-sm text-gray-500">
        {getShowingText()}
    </p>

            <span className="text-sm text-gray-600">
                Items per page
            </span>

            <select
                value={limit}
                onChange={handleLimitChange}
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#0880EF]"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>

        </div>

        <div className="flex items-center gap-4">

            <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 "
            >
                Previous
            </button>

            <p className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
            </p>

            <button
                onClick={handleNextPage}
                disabled={page === pagination.pages}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
            </button>

        </div>

    </div>
)}
    </div>
  );
}