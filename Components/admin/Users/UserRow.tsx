"use client";

import UserActions from "./UserActions";

import type { AdminUser } from "@/types/admin";

interface Props {
  user: AdminUser;
  onStatusUpdated: (updatedUser: AdminUser) => void;
  onUserDeleted: (userId: string) => void;
  onViewUser: (user: AdminUser) => void;
}

export default function UserRow({
  user,
  onStatusUpdated,
  onUserDeleted,
  onViewUser,
}: Props) {
  return (
    <tr className="border-b">

      <td className="px-6 py-4 font-medium">
        {user.name}
      </td>

      <td className="px-6 py-4">
        {user.email}
      </td>

      <td className="px-6 py-4 capitalize">
        {user.role}
      </td>

      <td className="px-6 py-4">

        <span
          className={`rounded-full px-3 py-1 text-sm ${
            user.isActive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>

      </td>

      <td className="px-6 py-4">

        <UserActions
          user={user}
          onStatusUpdated={onStatusUpdated}
          onUserDeleted={onUserDeleted}
          onViewUser={onViewUser}
        />

      </td>

    </tr>
  );
}