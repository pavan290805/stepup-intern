"use client";

import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";

export default function Header() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useLayout();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">

      {/* Left Side */}

      <div className="flex items-center gap-6">

        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 transition hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center">

          <div className="flex items-center gap-3">

            <Image
              src="/StepUpLogo_White.png"
              alt="StepUp"
              width={100}
              height={42}
            />

          </div>

          <div className="ml-5">

            <h1 className="text-2xl font-bold text-black">
              Admin Console
            </h1>

          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-8">

        {/* Notifications */}

        <div
          ref={notificationsRef}
          className="relative"
        >

          <button
            onClick={() => {
              setNotificationsOpen(
                (prev) => !prev
              );
              setProfileOpen(false);
            }}
            className="relative rounded-lg p-2 transition hover:bg-gray-100"
            title="Notifications"
          >

            <Bell
              size={24}
              className="text-black"
            />

            

          </button>

          {/* Notification Dropdown */}

          {notificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">

                <h2 className="font-semibold text-gray-900">
                  Notifications
                </h2>

                <span className="text-xs text-gray-500">
                  0 unread
                </span>

              </div>

              {/* Empty State */}

              <div className="px-4 py-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                  <Bell
                    size={22}
                    className="text-gray-500"
                  />

                </div>

                <p className="mt-4 font-medium text-gray-800">
                  No new notifications
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  You are all caught up.
                </p>

              </div>

            </div>
          )}

        </div>

        {/* Profile */}

        <div
          ref={profileRef}
          className="relative"
        >

          <button
            onClick={() => {
              setProfileOpen(
                (prev) => !prev
              );
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0880EF] text-lg font-semibold text-white">
              {user?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="text-left">

              <p className="font-semibold text-black">
                {user?.name}
              </p>

              <p className="text-sm text-gray-500">
                Administrator
              </p>

            </div>

            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform ${
                profileOpen
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {/* Profile Dropdown */}

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border border-gray-200 bg-white shadow-lg">

              {/* User Information */}

              <div className="border-b border-gray-100 px-4 py-4">

                <p className="font-semibold text-gray-900">
                  {user?.name}
                </p>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {user?.email}
                </p>

                <p className="mt-1 text-xs capitalize text-gray-400">
                  {user?.role}
                </p>

              </div>

              {/* Menu */}

              <div className="p-2">

                <Link
                  href="/admin/profile"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={18} />

                  <span>
                    My Profile
                  </span>
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={18} />

                  <span>
                    Settings
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />

                  <span>
                    Logout
                  </span>
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}