
import Navbar from "../../Components/Navbar";

export default function RecruiterProfile() {
return (
  <div className="min-h-screen bg-[#F8FAFC]">
    <Navbar />

    <div className="p-8">

          <div className="bg-white border border-gray-200 rounded-xl p-8">

            {/* Profile Header */}
<div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">

  <div className="flex items-center gap-5">

    <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
      LK
    </div>

    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Lalith Kumar
      </h1>

      <p className="text-gray-500">
        Recruiter
      </p>

      <p className="text-gray-500">
        StepUp Intern
      </p>
    </div>

  </div>

</div>
            {/* Recruiter Information */}
            <h2 className="text-2xl font-bold mb-5">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-10">

              <div>
                <label className="text-gray-500">
                  Email
                </label>

                <p className="font-medium text-gray-900">
                  lalith@example.com
                </p>
              </div>

              <div>
                <label className="text-gray-500">
                  Phone
                </label>

                <p className="font-medium text-gray-900">
                  +91 9876543210
                </p>
              </div>

              <div>
                <label className="text-gray-500">
                  Location
                </label>

                <p className="font-medium text-gray-900">
                  Hyderabad, India
                </p>
              </div>

              <div>
                <label className="text-gray-500">
                  Joined Date
                </label>

                <p className="font-medium text-gray-900">
                  June 2025
                </p>
              </div>

            </div>

            {/* Company Information */}
            <h2 className="text-2xl font-bold mb-5">
              Company Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-10">

              <div>
                <label className="text-gray-500">
                  Company Name
                </label>

                <p className="font-medium text-gray-900">
                  StepUp Intern
                </p>
              </div>

              <div>
                <label className="text-gray-500">
                  Website
                </label>

                <p className="font-medium text-gray-900">
                  www.stepupintern.com
                </p>
              </div>

              <div>
                <label className="text-gray-500">
                  Industry
                </label>

                <p className="font-medium text-gray-900">
                  Internship & Recruitment
                </p>
              </div>

              <div>
                <label className="text-gray-500">
                  Company Size
                </label>

                <p className="font-medium text-gray-900">
                  50+ Employees
                </p>
              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-10">

  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500">
      Internships Posted
    </p>

    <h3 className="text-3xl font-bold mt-2">
      8
    </h3>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500">
      Applicants Managed
    </p>

    <h3 className="text-3xl font-bold mt-2">
      120
    </h3>
  </div>

  <div className="bg-white border border-gray-200 rounded-xl p-5">
    <p className="text-sm text-gray-500">
      Interviews Conducted
    </p>

    <h3 className="text-3xl font-bold mt-2">
      35
    </h3>
  </div>

</div>

            {/* About Company */}
            <h2 className="text-2xl font-bold mb-4">
              About Company
            </h2>

            <p className="text-gray-600 leading-7">
              StepUp Intern helps students connect with
              recruiters and discover internship opportunities
              through a modern recruitment platform. Recruiters
              can post internships, manage applicants, schedule
              interviews and track hiring analytics in one place.
            </p>

           <div className="mt-8 flex gap-3">

  <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
    Edit Profile
  </button>

  <button className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50">
    Download Profile
  </button>

</div>

          </div>

        </div>
      </div>
  );
}