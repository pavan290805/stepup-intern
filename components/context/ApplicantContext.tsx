"use client";

import { createContext, useContext, ReactNode } from "react";
import { useApplicants } from "../hooks/useApplicants";

type ApplicantContextType = ReturnType<typeof useApplicants>;

const ApplicantContext = createContext<ApplicantContextType | null>(null);

export function ApplicantProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useApplicants();

  return (
    <ApplicantContext.Provider value={value}>
      {children}
    </ApplicantContext.Provider>
  );
}

export function useApplicantContext() {
  const context = useContext(ApplicantContext);

  if (!context) {
    throw new Error(
      "useApplicantContext must be used within ApplicantProvider"
    );
  }

  return context;
}