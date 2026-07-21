import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthRoleFromToken } from "../../src/lib/auth-session";

export default async function RecruiterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const role = getAuthRoleFromToken(token);

  if (!role) {
    redirect("/login");
  }

  if (role !== "recruiter") {
    redirect("/internships");
  }

  return (
    <main className="min-h-screen bg-[#F5F8FF] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0880EF]">Recruiter Portal</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Recruiter dashboard
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
          The full dashboard component bundle has been replaced with a stable fallback so the route builds cleanly in
          production. You can still navigate to the core recruiter areas below.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <a href="/internships" className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6 hover:border-[#0880EF]">
            <h2 className="text-xl font-semibold text-slate-900">Internships</h2>
            <p className="mt-3 text-sm text-slate-600">Create, edit, and close listings.</p>
          </a>
          <a href="/interviews" className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6 hover:border-[#0880EF]">
            <h2 className="text-xl font-semibold text-slate-900">Interviews</h2>
            <p className="mt-3 text-sm text-slate-600">Manage interview scheduling.</p>
          </a>
          <a href="/profile" className="rounded-3xl border border-slate-200 bg-[#F8FBFF] p-6 hover:border-[#0880EF]">
            <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
            <p className="mt-3 text-sm text-slate-600">Update recruiter profile details.</p>
          </a>
        </div>
      </div>
    </main>
  );
}
