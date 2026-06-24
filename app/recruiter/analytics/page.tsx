
import Navbar from "../../Components/Navbar";

export default function AnalyticsPage() {
  return (
  <div className="min-h-screen bg-[#F8FAFC]">
    <Navbar />

    <div className="p-8">

<div className="p-8">

  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900">
      Analytics Overview
    </h2>

    <p className="text-sm text-gray-500">
      Monitor recruitment performance and hiring metrics.
    </p>
  </div>

  {/* Stats Cards */}
  <div className="grid md:grid-cols-5 gap-5 mb-8">

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500">
        Applications
      </p>

      <h3 className="text-3xl font-bold mt-2 text-blue-600">
        250
      </h3>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500">
        Shortlisted
      </p>

      <h3 className="text-3xl font-bold mt-2 text-green-600">
        45
      </h3>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500">
        Rejected
      </p>

      <h3 className="text-3xl font-bold mt-2 text-red-500">
        80
      </h3>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500">
        Interviews
      </p>

      <h3 className="text-3xl font-bold mt-2 text-blue-600">
        30
      </h3>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500">
        Hiring Rate
      </p>

      <h3 className="text-3xl font-bold mt-2 text-green-600">
        32%
      </h3>
    </div>

  </div>

  {/* Recruitment Funnel */}
  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">

    <h2 className="text-lg font-semibold mb-6">
      Recruitment Funnel
    </h2>

    <div className="flex items-center justify-between text-center">

      <div>
        <p className="text-3xl font-bold">
          250
        </p>

        <p className="text-gray-500">
          Applications
        </p>
      </div>

      <span className="text-xl text-gray-400">
        →
      </span>

      <div>
        <p className="text-3xl font-bold text-green-600">
          45
        </p>

        <p className="text-gray-500">
          Shortlisted
        </p>
      </div>

      <span className="text-xl text-gray-400">
        →
      </span>

      <div>
        <p className="text-3xl font-bold text-blue-600">
          30
        </p>

        <p className="text-gray-500">
          Interviews
        </p>
      </div>

      <span className="text-xl text-gray-400">
        →
      </span>

      <div>
        <p className="text-3xl font-bold">
          12
        </p>

        <p className="text-gray-500">
          Hired
        </p>
      </div>

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


{/* Bottom Section */}
<div className="grid lg:grid-cols-2 gap-6">

  {/* Top Performing Internships */}
  <div className="bg-white border border-gray-200 rounded-xl p-6">

    <h2 className="text-lg font-semibold mb-5">
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

  {/* Recruitment Summary */}
  <div className="bg-white border border-gray-200 rounded-xl p-6">

    <h2 className="text-lg font-semibold mb-5">
      Recruitment Summary
    </h2>

    <div className="space-y-5">

      <div className="flex justify-between border-b pb-3">
        <span className="text-gray-600">
          Offer Letters Sent
        </span>

        <span className="font-bold text-xl">
          12
        </span>
      </div>

      <div className="flex justify-between border-b pb-3">
        <span className="text-gray-600">
          Offers Accepted
        </span>

        <span className="font-bold text-xl text-green-600">
          8
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">
          Acceptance Rate
        </span>

        <span className="font-bold text-xl text-blue-600">
          66%
        </span>
      </div>

    </div>

  </div>

</div>

          </div>
        </div>
      </div>
  );
}
