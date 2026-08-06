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

  useEffect(() => {
    fetchUsers({
      page,
      limit,
      search,
    });
  }, []);

  useEffect(() => {

    const timer = setTimeout(() => {

        setPage(1);

        fetchUsers({
            page: 1,
            limit,
            search,
        });

    }, 500);

    return () => clearTimeout(timer);

}, [search, limit]);

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

    </div>
  );
}