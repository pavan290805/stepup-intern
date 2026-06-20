import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

export default function RecruiterProfile() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Recruiter Profile
          </h1>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">
                Internships Posted
              </h3>

              <p className="text-3xl font-bold text-[#1E88E5]">
                8
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">
                Candidates Managed
              </h3>

              <p className="text-3xl font-bold text-green-600">
                120
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-gray-500">
                Interviews Scheduled
              </h3>

              <p className="text-3xl font-bold text-purple-600">
                15
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-[#1E88E5] text-white flex items-center justify-center text-4xl font-bold">
                L
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Lalith Kumar
                </h2>

                <p className="text-gray-500">
                  Recruiter
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-gray-500 mb-1">
                  Company Name
                </label>

                <p className="font-semibold">
                  StepUp Intern
                </p>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">
                  Email
                </label>

                <p className="font-semibold">
                  lalith@example.com
                </p>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">
                  Phone
                </label>

                <p className="font-semibold">
                  +91 9876543210
                </p>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">
                  Location
                </label>

                <p className="font-semibold">
                  Hyderabad, India
                </p>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">
                  Joined Date
                </label>

                <p className="font-semibold">
                  June 2025
                </p>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">
                  Internships Posted
                </label>

                <p className="font-semibold">
                  8
                </p>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">
                  Candidates Managed
                </label>

                <p className="font-semibold">
                  120
                </p>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">
                  Interviews Scheduled
                </label>

                <p className="font-semibold">
                  15
                </p>
              </div>

            </div>

            <div className="mt-8">
              <label className="block text-gray-500 mb-2">
                About Company
              </label>

              <p className="text-gray-700">
                StepUp Intern helps students connect
                with recruiters and discover internship
                opportunities through a modern platform.
                Our goal is to simplify internship hiring
                and provide opportunities for students
                across different domains.
              </p>
            </div>

            <div className="flex gap-4 mt-8">

              <button className="bg-[#1E88E5] text-white px-6 py-3 rounded-xl hover:bg-blue-700">
                Edit Profile
              </button>

              <button className="bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-black">
                Change Password
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}