"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await apiFetch("/auth/me");
        const role = response?.data?.role;

        if (role === "recruiter") {
          router.replace("/recruiter");
        }
      } catch (error) {
        if (!(error instanceof Error && error.message.includes("401"))) {
          console.error(error);
        }
      }
    };

    checkSession();
  }, [router]);

  return showSignup ? (
    <Signup setShowSignup={setShowSignup} />
  ) : (
    <Login setShowSignup={setShowSignup} />
  );
}