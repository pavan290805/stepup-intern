import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

export default function AnalyticsPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Recruitment Analytics
          </h1>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-500">
                Total Applications
              </h3>
              <p className="text-3xl font-bold text-[#1E88E5]">
                250
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-500">
                Shortlisted
              </h3>
              <p className="text-3xl font-bold text-green-600">
                45
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-500">
                Rejected
              </h3>
              <p className="text-3xl font-bold text-red-500">
                80
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-gray-500">
                Interviews Scheduled
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                30
              </p>
            </div>

          </div>

          {/* Top Internships */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Top Performing Internships
            </h2>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Internship
                  </th>

                  <th className="text-left py-3">
                    Applicants
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="py-3">
                    Frontend Developer Intern
                  </td>

                  <td>65</td>
                </tr>

                <tr className="border-b">
                  <td className="py-3">
                    AI/ML Intern
                  </td>

                  <td>52</td>
                </tr>

                <tr>
                  <td className="py-3">
                    UI/UX Designer Intern
                  </td>

                  <td>38</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Monthly Applications */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Monthly Applications
            </h2>

            <div className="space-y-5">

              <div>
                <div className="flex justify-between mb-2">
                  <span>January</span>
                  <span>40</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#1E88E5] h-3 rounded-full w-[40%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>February</span>
                  <span>65</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full w-[65%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>March</span>
                  <span>90</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-500 h-3 rounded-full w-[90%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>April</span>
                  <span>35</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full w-[35%]"></div>
                </div>
              </div>

            </div>
          </div>

          {/* Recruitment Summary */}
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">
                Offer Letters Sent
              </h3>

              <p className="text-3xl font-bold">
                12
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">
                Offers Accepted
              </h3>

              <p className="text-3xl font-bold text-green-600">
                8
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">
                Acceptance Rate
              </h3>

              <p className="text-3xl font-bold text-[#1E88E5]">
                66%
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}