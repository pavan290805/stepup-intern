import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedRedirectPath } from "../src/lib/auth-session";

import Navbar from "./navbar/Navbar";
import Home from "./home/Home";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  // We allow logged-in users to view the homepage if they explicitly navigate here.
  // The dashboard can be accessed via the profile dropdown.

  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}