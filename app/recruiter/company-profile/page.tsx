import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

export default function CompanyProfile() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold">
            Company Profile
          </h1>
        </div>
      </div>
    </div>
  );
}