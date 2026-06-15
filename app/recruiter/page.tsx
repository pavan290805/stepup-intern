import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function RecruiterDashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            Welcome Recruiter
          </h1>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3>Total Candidates</h3>
              <p className="text-3xl font-bold">120</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3>Shortlisted</h3>
              <p className="text-3xl font-bold">25</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3>Active Internships</h3>
              <p className="text-3xl font-bold">8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}