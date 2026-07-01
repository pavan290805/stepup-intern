import Navbar from "../../Components/Navbar";

const upcomingInterviews = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Frontend Intern",
    roleColor: "text-blue-500",
    date: "Oct 24, 10:30 AM",
    avatar: "AR",
    avatarBg: "bg-orange-400",
    available: true,
  },
  {
    id: 2,
    name: "Sophie Zhang",
    role: "Product Design",
    roleColor: "text-purple-500",
    date: "Oct 24, 2:00 PM",
    avatar: "SZ",
    avatarBg: "bg-pink-400",
    available: true,
  },
  {
    id: 3,
    name: "Jordan Mills",
    role: "Data Analyst",
    roleColor: "text-gray-500",
    date: "Oct 25, 11:00 AM",
    avatar: "JM",
    avatarBg: "bg-gray-300",
    available: false,
  },
];

const recentResults = [
  {
    name: "Elena Gilbert",
    initials: "EG",
    avatarBg: "bg-blue-500",
    role: "Marketing Intern",
    status: "Passed",
    statusColor: "text-green-600",
    statusDot: "bg-green-500",
    score: "4.8",
    max: "5.0",
  },
  {
    name: "Marcus Wright",
    initials: "MW",
    avatarBg: "bg-gray-700",
    role: "DevOps Intern",
    status: "Hold",
    statusColor: "text-gray-500",
    statusDot: "bg-gray-400",
    score: "3.2",
    max: "5.0",
  },
];

const teamAvailability = [
  { name: "John Doe", initials: "JD", bg: "bg-blue-500", status: "Available", statusColor: "text-green-600" },
  { name: "Alice Smith", initials: "AS", bg: "bg-amber-500", status: "In Meeting", statusColor: "text-amber-600" },
  { name: "Ben Kim", initials: "BK", bg: "bg-blue-800", status: "Busy", statusColor: "text-red-500" },
];

export default function InterviewsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Interview Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your <span className="text-blue-500 font-medium">upcoming</span> meetings and candidate evaluations.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Upcoming Today */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Upcoming Today</h2>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
                  <button className="px-3 py-1.5 bg-white text-gray-700 font-medium border-r border-gray-200 hover:bg-gray-50">List</button>
                  <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50">Calendar</button>
                </div>
              </div>

              <div className="space-y-3">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full ${interview.avatarBg} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                      {interview.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{interview.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className={`text-xs font-medium ${interview.roleColor}`}>{interview.role}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {interview.date}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                        Reschedule
                      </button>
                      <button
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                          interview.available
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!interview.available}
                      >
                        Join Meeting
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Results</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    {["Candidate", "Role", "Status", "Score", ""].map((col) => (
                      <th key={col} className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide pr-4">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentResults.map((r) => (
                    <tr key={r.name} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${r.avatarBg} flex items-center justify-center text-white text-xs font-semibold`}>
                            {r.initials}
                          </div>
                          <span className="text-sm font-medium text-blue-600">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-blue-500">{r.role}</td>
                      <td className="py-3 pr-4">
                        <span className={`flex items-center gap-1.5 text-sm font-medium ${r.statusColor}`}>
                          <span className={`w-2 h-2 rounded-full ${r.statusDot}`} />
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-sm">
                        <span className="font-semibold text-gray-900">{r.score}</span>
                        <span className="text-blue-500 font-medium">/{r.max}</span>
                      </td>
                      <td className="py-3">
                        <button className="text-xs font-medium text-blue-600 hover:underline whitespace-nowrap">
                          View Feedback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-64 flex-shrink-0 space-y-4">
            {/* Interviews Today Card */}
            <div className="bg-blue-600 rounded-xl p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-3">Interviews Today</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold">08</span>
                <span className="text-sm text-blue-200">Total scheduled</span>
              </div>
              <div className="flex justify-between border-t border-blue-500 pt-4">
                <div>
                  <p className="text-xs text-blue-200">Completed</p>
                  <p className="text-2xl font-bold mt-1">3</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-200">Remaining</p>
                  <p className="text-2xl font-bold mt-1">5</p>
                </div>
              </div>
            </div>

            {/* Pending Feedback */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Pending Feedback</h3>
              <p className="text-xs text-gray-500 mb-4">
                You have <span className="text-blue-600 font-semibold">2 interviews</span> that need your final evaluation scores.
              </p>
              <button className="w-full bg-gray-900 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-gray-800 transition">
                Submit Feedback
              </button>
            </div>

            {/* Team Availability */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Team Availability</h3>
              <div className="space-y-3">
                {teamAvailability.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${member.bg} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                      {member.initials}
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{member.name}</span>
                    <span className={`text-xs font-medium ${member.statusColor}`}>{member.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">StepUp Intern</p>
            <p className="text-xs text-gray-400 mt-0.5">© 2024 StepUp Intern. All rights reserved.</p>
          </div>
          <div className="flex gap-5 text-xs text-gray-500">
            {["Support", "Privacy Policy", "Terms of Service", "Help Center"].map((link) => (
              <a key={link} href="#" className="hover:text-blue-600 transition">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}