import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

export default function SettingsPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Settings
          </h1>

          <div className="grid gap-6">

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                🔔 Notification Settings
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked />
                  Email Notifications
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked />
                  Application Alerts
                </label>

                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked />
                  Interview Reminders
                </label>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                🔒 Security Settings
              </h2>

              <div className="grid gap-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="border rounded-xl p-3"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  className="border rounded-xl p-3"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="border rounded-xl p-3"
                />

                <button className="bg-[#1E88E5] text-white px-6 py-3 rounded-xl hover:bg-blue-700 w-fit">
                  Update Password
                </button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                ⚙️ Account Settings
              </h2>

              <div className="grid gap-4">

                <select className="border rounded-xl p-3">
                  <option>English</option>
                  <option>Hindi</option>
                </select>

                <select className="border rounded-xl p-3">
                  <option>Light Theme</option>
                  <option>Dark Theme</option>
                </select>

                <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 w-fit">
                  Save Changes
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}