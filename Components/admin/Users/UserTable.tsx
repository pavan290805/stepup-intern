"use client";

import UserRow from "./UserRow";

import type { AdminUser } from "@/types/admin";

interface Props {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

export default function UserTable({
  users,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">

      <table className="w-full">

        <thead className="bg-[#0880EF] text-white">

          <tr>

            <th className="px-6 py-4 text-left">
              Name
            </th>

            <th className="px-6 py-4 text-left">
              Email
            </th>

            <th className="px-6 py-4 text-left">
              Role
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}