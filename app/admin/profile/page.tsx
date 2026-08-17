"use client";

import {
  User,
  Mail,
  Shield,
  CheckCircle,
  Lock,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function AdminProfilePage() {
  const { user, isAuthenticated } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl bg-white px-8 py-6 shadow">
          <p className="text-gray-600">
            Unable to load profile.
          </p>
        </div>
      </div>
    );
  }

  const initial =
    user.name?.charAt(0).toUpperCase() || "A";

  return (
    <div className="space-y-8">

      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-black">
          My Profile
        </h1>

        <p className="mt-2 text-black/70">
          Manage and view your administrator profile.
        </p>
      </div>

      {/* Main Profile Layout */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Profile Identity Card */}

        <div className="rounded-2xl bg-white shadow-sm">

          <div className="rounded-t-2xl bg-gradient-to-r from-blue-50 to-white px-6 py-8">

            <div className="flex justify-center">

              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-[#0880EF] text-4xl font-semibold text-white shadow">
                {initial}
              </div>

            </div>

          </div>

          <div className="px-6 pb-7 text-center">

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {user.name}
            </h2>

            <p className="mt-1 text-gray-500">
              Administrator
            </p>

            <p className="mt-2 truncate text-sm text-gray-500">
              {user.email}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              <CheckCircle size={16} />
              Active Account
            </div>

          </div>

          <div className="grid grid-cols-2 border-t border-gray-200">

            <div className="border-r border-gray-200 px-5 py-5">

              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="mt-1 font-semibold capitalize text-gray-900">
                {user.role}
              </p>

            </div>

            <div className="px-5 py-5">

              <p className="text-sm text-gray-500">
                Access
              </p>

              <p className="mt-1 font-semibold text-[#0880EF]">
                Admin
              </p>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="space-y-6 lg:col-span-2">

          {/* Account Information */}

          <div className="rounded-2xl bg-white shadow-sm">

            <div className="border-b border-gray-200 px-7 py-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your administrator account details.
              </p>

            </div>

            <div className="grid gap-5 p-7 md:grid-cols-2">

              {/* Name */}

              <div className="rounded-xl bg-gray-50 p-5">

                <div className="flex items-center gap-3">

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

                    <p className="mt-1 font-semibold text-gray-900">
                      {user.name}
                    </p>
                  </div>

                </div>

              </div>

              {/* Email */}

              <div className="rounded-xl bg-gray-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Mail
                      size={20}
                      className="text-[#0880EF]"
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm text-gray-500">
                      Email Address
                    </p>

                    <p className="mt-1 truncate font-semibold text-gray-900">
                      {user.email}
                    </p>

                  </div>

                </div>

              </div>

              {/* Role */}

              <div className="rounded-xl bg-gray-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Shield
                      size={20}
                      className="text-[#0880EF]"
                    />
                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Account Role
                    </p>

                    <p className="mt-1 font-semibold capitalize text-gray-900">
                      {user.role}
                    </p>

                  </div>

                </div>

              </div>

              {/* Authentication */}

              <div className="rounded-xl bg-gray-50 p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Lock
                      size={20}
                      className="text-[#0880EF]"
                    />
                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Authentication
                    </p>

                    <p className="mt-1 font-semibold text-green-600">
                      {isAuthenticated
                        ? "Authenticated"
                        : "Not authenticated"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Access Overview */}

          <div className="rounded-2xl bg-white shadow-sm">

            <div className="border-b border-gray-200 px-7 py-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Admin Access
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your current access level within StepUp Intern.
              </p>

            </div>

            <div className="p-7">

              <div className="rounded-xl bg-blue-50 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white">
                    <Shield
                      size={22}
                      className="text-[#0880EF]"
                    />
                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      Administrator Access
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      You are signed in with an administrator
                      account and can access the admin management
                      portal.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Account & Security */}

          <div className="rounded-2xl bg-white shadow-sm">

            <div className="border-b border-gray-200 px-7 py-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Account & Security
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current authentication and account status.
              </p>

            </div>

            <div className="p-7">

              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">
                    <CheckCircle
                      size={22}
                      className="text-green-600"
                    />
                  </div>

                  <div>

                    <p className="font-semibold text-gray-900">
                      Account Status
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Your administrator account is currently active.
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  Active
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}