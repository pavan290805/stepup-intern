"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import RecruiterPage from "./Components/RecruiterPage/RecruiterPage";
import InterviewsPage from "./Components/RecruiterPage/InterviewsPage";
import CloseInternshipsPage from "./Components/RecruiterPage/CloseInternshipsPage";
import EditInternshipsPage from "./Components/RecruiterPage/EditInternshipsPage";
import FeaturedInternshipsPage from "./Components/RecruiterPage/FeaturedInternshipsPage";

const validRoutes = new Set(["edit-internships", "close-internships", "featured-internships", "interviews"]);

export default function Home() {
  const searchParams = useSearchParams();
  const page = searchParams?.get("page") ?? "";

  const selectedPage = useMemo(() => {
    if (!page || !validRoutes.has(page)) {
      return "dashboard";
    }

    return page;
  }, [page]);

  if (selectedPage === "edit-internships") {
    return <EditInternshipsPage />;
  }

  if (selectedPage === "close-internships") {
    return <CloseInternshipsPage />;
  }

  if (selectedPage === "interviews") {
    return <InterviewsPage />;
  }

  if (selectedPage === "featured-internships") {
    return <FeaturedInternshipsPage />;
  }

  return <RecruiterPage />;
}
