"use client";

import { useState } from "react";

import { useAdmin } from "@/hooks/useAdmin";

import DeleteUserDialog from "./DeleteUserDialog";

import type { AdminUser } from "@/types/admin";

import { toast } from "sonner";

interface Props {
  user: AdminUser;
  onStatusUpdated: (updatedUser: AdminUser) => void;
  onUserDeleted: (userId: string) => void;
  onViewUser: (user: AdminUser) => void;
}

export default function UserActions({
  user,
  onStatusUpdated,
  onUserDeleted,
  onViewUser,
}: Props) {
  const {
    deleteUser,
    updateUserStatus,
  } = useAdmin();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function handleDelete() {
  try {
    setLoading(true);

    await deleteUser(user._id);

    toast.success(`${user.name} deleted successfully`);

    setDeleteDialogOpen(false);
    onUserDeleted(user._id);

  } catch (error) {
    console.error(error);

    toast.error("Failed to delete user");

  } finally {
    setLoading(false);
  }
}

  async function handleStatus() {
  try {
    setLoading(true);

    const updatedUser = await updateUserStatus(user._id, {
      isActive: !user.isActive,
    });

    toast.success(
      updatedUser.isActive
        ? `${updatedUser.name} activated successfully`
        : `${updatedUser.name} deactivated successfully`
    );

    onStatusUpdated(updatedUser);
  } catch (error) {
    console.error(error);

    toast.error("Failed to update user status");
  } finally {
    setLoading(false);
  }
}

  return (
    <>
      <div className="flex justify-center gap-3">

        <button
          onClick={() => onViewUser(user)}
          className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white">
          View
        </button>
        <button
          onClick={handleStatus}
          className="rounded-lg bg-[#0880EF] px-4 py-2 text-sm text-white"
        >
          {user.isActive ? "Deactivate" : "Activate"}
        </button>

        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
        >
          Delete
        </button>

      </div>

      <DeleteUserDialog
        open={deleteDialogOpen}
        userEmail={user.email}
        loading={loading}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}