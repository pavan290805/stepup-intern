import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

export default function CandidateManagement() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold">
            Candidate Management
          </h1>
        </div>
      </div>
    </div>
  );
}