"use client";

import { useEffect, useState } from "react";
import Login from "../../Components/auth/Login";
import Signup from "../../Components/auth/Signup";

export default function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          if (!cancelled) {
            setReady(true);
          }
          return;
        }

        const payload = await response.json();
        const role = payload?.data?.role;

        if (!cancelled && role === "recruiter") {
          window.location.replace("/recruiter");
          return;
        }

        if (!cancelled && role === "student") {
          window.location.replace("/internships");
          return;
        }

        if (!cancelled) {
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    void checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return showSignup ? <Signup setShowSignup={setShowSignup} /> : <Login setShowSignup={setShowSignup} />;
}
