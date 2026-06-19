import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Link from "next/link";

export default function RecruiterDashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            Welcome Recruiter
          </h1>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">
                Total Candidates
              </h3>
              <p className="text-3xl font-bold">120</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">
                Shortlisted
              </h3>
              <p className="text-3xl font-bold">25</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">
                Active Internships
              </h3>
              <p className="text-3xl font-bold">8</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
  <h3 className="text-gray-500">
    Pending Applications
  </h3>
  <p className="text-3xl font-bold">42</p>
</div>
          </div>

          {/* Recent Internships */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Recent Internships
              </h2>

              <Link
                href="/recruiter/internships"
                className="bg-[#1E88E5] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View All
              </Link>
            </div>
            {/* Recent Activity */}
<div className="bg-white rounded-2xl shadow p-6 mt-8">
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-2xl font-bold">
      Recent Activity
    </h2>

    <span className="text-sm text-gray-500">
      Last 24 Hours
    </span>
  </div>
  {/* Quick Actions */}
<div className="bg-white rounded-2xl shadow p-6 mt-8">
  <h2 className="text-2xl font-bold mb-5">
    Quick Actions
  </h2>

  <div className="grid md:grid-cols-4 gap-4">

    <Link
      href="/recruiter/create-internship"
      className="bg-[#1E88E5] text-white p-5 rounded-xl text-center hover:bg-blue-700 transition"
    >
      ➕ Create Internship
    </Link>

    <Link
      href="/recruiter/candidate-management"
      className="bg-green-600 text-white p-5 rounded-xl text-center hover:bg-green-700 transition"
    >
      👥 View Candidates
    </Link>

    <Link
      href="/recruiter/company-profile"
      className="bg-purple-600 text-white p-5 rounded-xl text-center hover:bg-purple-700 transition"
    >
      🏢 Company Profile
    </Link>

    <Link
      href="/recruiter/profile"
      className="bg-orange-500 text-white p-5 rounded-xl text-center hover:bg-orange-600 transition"
    >
      👤 My Profile
    </Link>

  </div>
</div>

  <div className="space-y-4">

    <div className="flex items-center gap-4 border-b pb-3">
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        ✅
      </div>

      <div>
        <p className="font-medium">
          Rahul Kumar applied for Frontend Developer Intern
        </p>

        <p className="text-sm text-gray-500">
          10 minutes ago
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4 border-b pb-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        🎉
      </div>

      <div>
        <p className="font-medium">
          AI/ML Internship created successfully
        </p>

        <p className="text-sm text-gray-500">
          1 hour ago
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4 border-b pb-3">
      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
        ⭐
      </div>

      <div>
        <p className="font-medium">
          Priya Sharma shortlisted for interview
        </p>

        <p className="text-sm text-gray-500">
          Today
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        ⏰
      </div>

      <div>
        <p className="font-medium">
          UI/UX Designer Internship closed
        </p>

        <p className="text-sm text-gray-500">
          Yesterday
        </p>
      </div>
    </div>

  </div>
</div>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Title
                  </th>
                  <th className="text-left py-3">
                    Duration
                  </th>
                  <th className="text-left py-3">
                    Stipend
                  </th>
                  <th className="text-left py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="py-3">
                    Frontend Developer Intern
                  </td>
                  <td>3 Months</td>
                  <td>₹10,000</td>
                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Active
                    </span>
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="py-3">
                    AI/ML Intern
                  </td>
                  <td>6 Months</td>
                  <td>₹15,000</td>
                  <td>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Active
                    </span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3">
                    UI/UX Designer Intern
                  </td>
                  <td>2 Months</td>
                  <td>₹8,000</td>
                  <td>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                      Closed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}