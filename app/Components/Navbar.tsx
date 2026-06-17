export default function Navbar() {
  return (
    <div className="h-20 bg-white shadow-sm border-b flex items-center justify-between px-8">

      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Recruiter Dashboard
        </h1>

        <p className="text-gray-500">
          Manage candidates and company profile
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button className="text-2xl hover:scale-110 transition">
          🔔
        </button>

        <div className="w-12 h-12 rounded-full bg-[#1E88E5] text-white flex items-center justify-center font-bold text-lg">
          L
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            Lalith Kumar
          </h3>

          <p className="text-gray-500 text-sm">
            Recruiter
          </p>
        </div>

      </div>
    </div>
  );
}