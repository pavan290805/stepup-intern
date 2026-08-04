"use client";

import { useEffect, useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import UserTable from "../../../Components/admin/Users/UserTable";

import type { AdminUser } from "@/types/admin";

export default function UsersPage() {
  const { getUsers, loading, error } = useAdmin();

  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await getUsers();

      setUsers(response.users);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-black">
          Users
        </h1>

        <p className="mt-2 text-black/70">
          Manage all registered users.
        </p>
      </div>

      <UserTable
        users={users}
        loading={loading}
        error={error}
      />

    </div>
  );
}