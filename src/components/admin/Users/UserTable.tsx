"use client";

import UserRow from "./UserRow";

import type { AdminUser } from "@/types/admin";
import { Users } from "lucide-react";

interface Props {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  onStatusUpdated: (updatedUser: AdminUser) => void;
  onUserDeleted: (userId: string) => void;
  onViewUser: (user: AdminUser) => void;
}

export default function UserTable({
  users,
  loading,
  error,
  onStatusUpdated,
  onUserDeleted,
  onViewUser,
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
  if (users.length === 0) {
  return (
    <div className="rounded-xl bg-white p-12 text-center shadow">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
        <Users className="h-8 w-8 text-[#0880EF]" />
      </div>

      <h3 className="mt-5 text-xl font-semibold text-gray-900">
        No Users Found
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        There are no users to display at the moment.
      </p>
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
              onStatusUpdated={onStatusUpdated}
              onUserDeleted={onUserDeleted}
              onViewUser={onViewUser}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}