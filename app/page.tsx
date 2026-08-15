import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedRedirectPath } from "../src/lib/auth-session";

import Navbar from "@/components/navigation/PublicNavbar";
import Home from "@/components/home/Home";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const redirectPath = getAuthenticatedRedirectPath(token);

  if (redirectPath) {
    redirect(redirectPath);
  }

  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}