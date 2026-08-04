"use client";

import { useState } from "react";

interface DeleteUserDialogProps {
  open: boolean;
  userEmail: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserDialog({
  open,
  userEmail,
  loading,
  onClose,
  onConfirm,
}: DeleteUserDialogProps) {
  const [input, setInput] = useState("");

  if (!open) return null;

  const canDelete = input === userEmail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="text-2xl font-bold text-black">
          Delete User
        </h2>

        <p className="mt-3 text-gray-600">
          This action cannot be undone.
        </p>

        <p className="mt-2 text-gray-600">
          Type
          <span className="mx-1 font-semibold text-[#0880EF]">
            {userEmail}
          </span>
          to continue.
        </p>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter user email"
          className="mt-5 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#0880EF]"
        />

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2"
          >
            Cancel
          </button>

          <button
            disabled={!canDelete || loading}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}