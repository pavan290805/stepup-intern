import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedRedirectPath } from "../src/lib/auth-session";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const redirectPath = getAuthenticatedRedirectPath(token);

  redirect(redirectPath || "/login");
}
