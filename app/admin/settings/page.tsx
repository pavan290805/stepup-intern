"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">

      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-black">
          Settings
        </h1>

        <p className="mt-2 text-black/70">
          Manage your administrator account settings.
        </p>
      </div>

      {/* Account Settings */}

      <div className="max-w-4xl rounded-xl bg-white shadow">

        <div className="border-b border-gray-200 px-8 py-6">

          <h2 className="text-xl font-semibold text-gray-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Information associated with your administrator account.
          </p>

        </div>

        <div className="grid gap-6 px-8 py-8 md:grid-cols-2">

          {/* Name */}

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <User
                size={20}
                className="text-[#0880EF]"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-medium text-gray-900">
                {user?.name || "Not available"}
              </p>
            </div>

          </div>

          {/* Email */}

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
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
                {user?.email || "Not available"}
              </p>
            </div>

          </div>

          {/* Role */}

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
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
                {user?.role || "Administrator"}
              </p>
            </div>

          </div>

          {/* Account Status */}

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <Lock
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

      {/* Notification Settings */}

      <div className="max-w-4xl rounded-xl bg-white shadow">

        <div className="border-b border-gray-200 px-8 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Bell
                size={20}
                className="text-[#0880EF]"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Notification preferences will be available here.
              </p>
            </div>

          </div>

        </div>

        <div className="px-8 py-6">

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

            <p className="font-medium text-gray-900">
              Notification management
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Notification preferences will be connected to the
              notification system when the backend notification
              service is implemented.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}