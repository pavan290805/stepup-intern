"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getCompanies, getCompany, type CompanyApiItem } from "@/lib/api";

type CompanyPagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

type CompanyContextValue = {
  companies: CompanyApiItem[];
  selectedCompany: CompanyApiItem | null;
  pagination: CompanyPagination | null;
  loading: boolean;
  error: string | null;
  loadCompanies: (query?: string) => Promise<void>;
  loadCompanyById: (id: string) => Promise<void>;
  clearSelectedCompany: () => void;
};

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<CompanyApiItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyApiItem | null>(null);
  const [pagination, setPagination] = useState<CompanyPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = useCallback(async (query = "page=1&limit=20") => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCompanies(query);
      setCompanies(result.companies ?? []);
      setPagination(result.pagination ?? null);
    } catch (err) {
      setCompanies([]);
      setPagination(null);
      setError(err instanceof Error ? err.message : "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCompanyById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCompany(id);
      setSelectedCompany(result);
    } catch (err) {
      setSelectedCompany(null);
      setError(err instanceof Error ? err.message : "Failed to load company");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelectedCompany = useCallback(() => {
    setSelectedCompany(null);
  }, []);

  const value = useMemo<CompanyContextValue>(
    () => ({
      companies,
      selectedCompany,
      pagination,
      loading,
      error,
      loadCompanies,
      loadCompanyById,
      clearSelectedCompany,
    }),
    [companies, selectedCompany, pagination, loading, error, loadCompanies, loadCompanyById, clearSelectedCompany]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompanyContext() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
}
