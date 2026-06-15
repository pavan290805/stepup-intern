export default function Navbar() {
  return (
    <div className="h-20 bg-white shadow-sm border-b flex items-center justify-between px-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Recruiter Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Manage candidates and company profile
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button className="text-2xl hover:scale-110 transition">
          🔔
        </button>

        <div className="w-11 h-11 rounded-full bg-[#1E88E5] text-white flex items-center justify-center font-bold">
          L
        </div>

        <div>
          <p className="font-semibold text-gray-800">
            Lalith Kumar
          </p>

          <p className="text-sm text-gray-500">
            Recruiter
          </p>
        </div>

      </div>

    </div>
  );
}