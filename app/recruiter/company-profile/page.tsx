import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

export default function CompanyProfile() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="font-bold text-xl mb-3">
              Profile Completion
            </h3>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-[#1E88E5] h-4 rounded-full"
                style={{ width: "90%" }}
              />
            </div>

            <div className="flex justify-between mt-2">
              <p className="text-gray-600">
                90% Complete
              </p>

              <p className="text-[#1E88E5] font-semibold">
                9/10 Sections Completed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-[#1E88E5] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  S
                </div>

                <label className="mt-4 cursor-pointer bg-[#1E88E5] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Upload Logo
                  <input
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold">
                    StepUp Intern
                  </h2>

                  <span className="text-xl">
                    ✏️
                  </span>
                </div>

                <p className="text-xl text-gray-500">
                  Education Technology
                </p>

                <p className="text-gray-400 mt-2">
                  Hyderabad, India
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">
              Company Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Company Name
                </label>

                <input
                  type="text"
                  defaultValue="StepUp Intern"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Industry
                </label>

                <input
                  type="text"
                  defaultValue="Education Technology"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Website
                </label>

                <input
                  type="text"
                  defaultValue="www.stepupintern.com"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Location
                </label>

                <input
                  type="text"
                  defaultValue="Hyderabad"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Company Size
                </label>

                <input
                  type="text"
                  defaultValue="50-100 Employees"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Founded Year
                </label>

                <input
                  type="text"
                  defaultValue="2025"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-6">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Email
                </label>

                <input
                  type="email"
                  defaultValue="contact@stepupintern.com"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Phone Number
                </label>

                <input
                  type="text"
                  defaultValue="+91 9876543210"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Company Address
                </label>

                <input
                  type="text"
                  defaultValue="Hyderabad, Telangana"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  LinkedIn Profile
                </label>

                <input
                  type="text"
                  defaultValue="linkedin.com/company/stepupintern"
                  className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-6">
              About Company
            </h2>

            <textarea
              rows={5}
              defaultValue="StepUp Intern is a platform that connects students with internships, industry projects, and career opportunities."
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
            />

            <button className="mt-6 bg-[#1E88E5] text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg md:w-auto w-full">
              Save Changes
            </button>

            <p className="text-green-600 mt-4 font-medium">
              Profile Information Updated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}