"use client";

import { useAuth } from "@/hooks/useAuth";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <p className="text-gray-600">
          Unable to load profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-black">
          My Profile
        </h1>

        <p className="mt-2 text-black/70">
          View your administrator account information.
        </p>
      </div>

      {/* Profile Card */}

      <div className="max-w-3xl rounded-xl bg-white shadow">

        {/* Profile Header */}

        <div className="flex items-center gap-6 border-b px-8 py-6">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0880EF] text-3xl font-semibold text-white">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.name}
            </h2>

            <p className="mt-1 text-gray-500">
              Administrator
            </p>
          </div>

        </div>

        {/* Account Information */}

        <div className="space-y-6 px-8 py-8">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <User
                size={20}
                className="text-[#0880EF]"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="font-medium text-gray-900">
                {user.name}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Mail
                size={20}
                className="text-[#0880EF]"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium text-gray-900">
                {user.email}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Shield
                size={20}
                className="text-[#0880EF]"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="font-medium capitalize text-gray-900">
                {user.role}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Calendar
                size={20}
                className="text-[#0880EF]"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Account Status
              </p>

              <p className="font-medium text-green-600">
                Active
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}