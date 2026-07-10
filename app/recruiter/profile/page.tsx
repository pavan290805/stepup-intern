"use client";
import { useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import Navbar from "../../Components/Navbar";

export default function RecruiterProfile() {
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [jobTitle, setJobTitle] = useState("");
const [phone, setPhone] = useState("");

const [companyName, setCompanyName] = useState("");
const [headquarters, setHeadquarters] = useState("");
const [companyWebsite, setCompanyWebsite] = useState("");

  const [currentPassword, setCurrentPassword] = useState("••••••••");
  const [newPassword, setNewPassword] = useState("");

  const [notifApplicants, setNotifApplicants] = useState(true);
  const [notifInterviews, setNotifInterviews] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  useEffect(() => {
  const loadProfile = async () => {
    try {
      const response = await apiFetch("/recruiters/profile");

      const profile = response.data;

      setFullName(profile.userId?.name || "");
      setEmail(profile.userId?.email || "");
      setJobTitle(profile.designation || "");
      setPhone(profile.phoneNumber || "");

      if (profile.companyId) {
        setCompanyName(profile.companyId.name || "");
        setHeadquarters(profile.companyId.headquarters || "");
        setCompanyWebsite(profile.companyId.website || "");
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return;
      }

      console.error(error);
    }
  };

  loadProfile();
}, []);
const handleSave = async () => {
  try {
    await apiFetch("/recruiters/profile", {
      method: "PATCH",
      body: JSON.stringify({
        designation: jobTitle,
        phoneNumber: phone,
      }),
    });

    alert("Profile updated successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to update profile");
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page heading */}
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your professional profile and recruiter preferences.
        </p>

        <div className="flex gap-6 mt-6 items-start">
          {/* Left column */}
          <div className="flex-1 space-y-5">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Personal Information
                </h2>
<button onClick={handleSave}>
  Save Changes
</button>
              </div>

              <div className="flex gap-5 items-start">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
                    LK
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                </div>

                {/* Fields */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Job Title
                    </label>
                    <input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
                Company Details
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Company Name
                  </label>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Headquarters
                  </label>
                  <input
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Company Website
                </label>
                <input
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Verification notice */}
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-blue-700">Company Verification</p>
                  <p className="text-xs text-blue-500 mt-0.5">
                    Your company profile is currently verified. Updating these details may trigger a re-verification process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-64 shrink-0 space-y-4">
            {/* Security */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Security
              </h2>

              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 12 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition">
                Update Password
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                Notifications
              </h2>

              <div className="space-y-4">
                {[
                  {
                    label: "New Applicants",
                    sub: "Alerts for new internship matches",
                    value: notifApplicants,
                    set: setNotifApplicants,
                  },
                  {
                    label: "Interview Reminders",
                    sub: "24h before scheduled sessions",
                    value: notifInterviews,
                    set: setNotifInterviews,
                  },
                  {
                    label: "Marketing Updates",
                    sub: "News and feature updates",
                    value: notifMarketing,
                    set: setNotifMarketing,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                    <button
                      onClick={() => item.set(!item.value)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        item.value ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          item.value ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-red-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2">
                Danger Zone
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Deactivating your account will pause all active internship listings.
              </p>
              <button className="w-full border border-red-400 text-red-500 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition">
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}