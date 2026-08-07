"use client";

import type { AdminUser } from "@/types/admin";

interface Props {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
}

export default function UserDetailsDialog({
  open,
  user,
  onClose,
}: Props) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            User Details
          </h2>

          <button
            onClick={onClose}
            className="text-3xl leading-none text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 border-b px-6 py-5">

          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover border"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0880EF] text-2xl font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {user.name}
            </h3>

            <p className="text-gray-500">
              {user.email}
            </p>
          </div>

        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-6 py-6">

          <div>
            <p className="text-sm text-gray-500">
              Role
            </p>

            <p className="mt-1 font-medium capitalize">
              {user.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                user.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Verification
            </p>

            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                user.isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {user.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>


          <div>
  <p className="text-sm text-gray-500">
    Created At
  </p>

  <p className="mt-1 font-medium">
    {new Date(user.createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>
</div>

<div>
  <p className="text-sm text-gray-500">
    Updated At
  </p>

  <p className="mt-1 font-medium">
    {new Date(user.updatedAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>
</div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-lg bg-[#0880EF] px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}