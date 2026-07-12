import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RecruiterDashboard from "../../recruiter/RecruiterDashboard";
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

  return <RecruiterDashboard />;
}