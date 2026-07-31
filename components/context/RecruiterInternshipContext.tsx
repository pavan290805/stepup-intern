"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";

import {
  useRecruiterInternships,
  Internship,
} from "../hooks/useRecruiterInternships";

type RecruiterInternshipContextType =
  ReturnType<typeof useRecruiterInternships> & {
    selectedInternship: Internship | null;
    setSelectedInternship: React.Dispatch<
      React.SetStateAction<Internship | null>
    >;
  };

const RecruiterInternshipContext =
  createContext<RecruiterInternshipContextType | null>(null);

export function RecruiterInternshipProvider({
  children,
}: {
  children: ReactNode;
}) {
  const recruiter = useRecruiterInternships();

  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);

  const contextValue = useMemo(
    () => ({
      ...recruiter,
      selectedInternship,
      setSelectedInternship,
    }),
    [recruiter, selectedInternship]
  );

  return (
    <RecruiterInternshipContext.Provider value={contextValue}>
      {children}
    </RecruiterInternshipContext.Provider>
  );
}

export function useRecruiterInternshipContext() {
  const context = useContext(RecruiterInternshipContext);

  if (!context) {
    throw new Error(
      "useRecruiterInternshipContext must be used within RecruiterInternshipProvider"
    );
  }

  return context;
}