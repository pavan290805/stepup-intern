"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import RecruiterPage from "./Components/RecruiterPage/RecruiterPage";
import InterviewsPage from "./Components/RecruiterPage/InterviewsPage";
import CloseInternshipsPage from "./Components/RecruiterPage/CloseInternshipsPage";
import FeaturedInternshipsPage from "./Components/RecruiterPage/FeaturedInternshipsPage";
import ProfilePage from "./Components/RecruiterPage/ProfilePage";

const validRoutes = new Set(["close-internships", "featured-internships", "interviews", "profile"]);

export default function Home() {
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "";

  const selectedPage = useMemo(() => {
    if (!page || page === "edit-internships" || !validRoutes.has(page)) {
      return "dashboard";
    }

    return page;
  }, [page]);

  if (selectedPage === "close-internships") {
    return <CloseInternshipsPage />;
  }

  if (selectedPage === "interviews") {
    return <InterviewsPage />;
  }

  if (selectedPage === "featured-internships") {
    return <FeaturedInternshipsPage />;
  }

  if (selectedPage === "profile") {
    return <ProfilePage />;
  }

  return <RecruiterPage />;
}
