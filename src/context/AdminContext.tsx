"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import type {
  AdminStatistics,
  UsersResponse,
  CompaniesResponse,
  RecruitersResponse,
  InternshipsResponse,
  UpdateUserStatusRequest,
  VerificationActionRequest,
  UpdateInternshipStatusRequest,
} from "@/types/admin";

import {
  getAdminStatistics,
  getAdminUsers,
  updateAdminUserStatus,
  deleteAdminUser,
  getPendingCompanies,
  verifyCompany as verifyCompanyApi,
  getPendingRecruiters,
  verifyRecruiter as verifyRecruiterApi,
  getAdminInternships,
  updateAdminInternshipStatus as updateAdminInternshipStatusApi,
  deleteAdminInternship as deleteAdminInternshipApi,
} from "@/lib/api";


interface AdminContextType {
  statistics: AdminStatistics | null;

  loading: boolean;

  error: string | null;

  loadStatistics: () => Promise<void>;

  getUsers: (query?: string) => Promise<UsersResponse>;

  updateUserStatus: (
    id: string,
    input: UpdateUserStatusRequest
  ) => Promise<void>;

  deleteUser: (id: string) => Promise<void>;

  getCompanies: (query?: string) => Promise<CompaniesResponse>;

  verifyCompany: (
    id: string,
    input: VerificationActionRequest
  ) => Promise<void>;

  getRecruiters: (query?: string) => Promise<RecruitersResponse>;

  verifyRecruiter: (
    id: string,
    input: VerificationActionRequest
  ) => Promise<void>;

  getInternships: (query?: string) => Promise<InternshipsResponse>;

  updateInternshipStatus: (
    id: string,
    input: UpdateInternshipStatusRequest
  ) => Promise<void>;

  deleteInternship: (id: string) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined
);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({
  children,
}: AdminProviderProps) {
      const [statistics, setStatistics] =
    useState<AdminStatistics | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);
  const loadStatistics = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await getAdminStatistics();
    setStatistics(data);
    
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to load dashboard statistics");
    }
  } finally {
    setLoading(false);
  }
};
  const getUsers = async (
  query = "page=1&limit=20"
): Promise<UsersResponse> => {
  try {
    setLoading(true);
    setError(null);

    return await getAdminUsers(query);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to fetch users");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const updateUserStatus = async (
  id: string,
  input: UpdateUserStatusRequest
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    await updateAdminUserStatus(id, input);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to update user status");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const deleteUser = async (
  id: string
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    await deleteAdminUser(id);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to delete user");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const getCompanies = async (
  query = "page=1&limit=20"
): Promise<CompaniesResponse> => {
  try {
    setLoading(true);
    setError(null);

    return await getPendingCompanies(query);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to fetch companies");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const verifyCompany = async (
  id: string,
  input: VerificationActionRequest
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    await verifyCompanyApi(id, input);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to verify company");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const getRecruiters = async (
  query = "page=1&limit=20"
): Promise<RecruitersResponse> => {
  try {
    setLoading(true);
    setError(null);

    return await getPendingRecruiters(query);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to fetch recruiters");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const verifyRecruiter = async (
  id: string,
  input: VerificationActionRequest
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    await verifyRecruiterApi(id, input);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to verify recruiter");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const getInternships = async (
  query = "page=1&limit=20"
): Promise<InternshipsResponse> => {
  try {
    setLoading(true);
    setError(null);

    return await getAdminInternships(query);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to fetch internships");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const updateInternshipStatus = async (
  id: string,
  input: UpdateInternshipStatusRequest
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    await updateAdminInternshipStatusApi(id, input);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to update internship status");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  const deleteInternship = async (
  id: string
): Promise<void> => {
  try {
    setLoading(true);
    setError(null);

    await deleteAdminInternshipApi(id);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to delete internship");
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
return (
  <AdminContext.Provider
    value={{
      statistics,
      loading,
      error,

      loadStatistics,

      getUsers,
      updateUserStatus,
      deleteUser,

      getCompanies,
      verifyCompany,

      getRecruiters,
      verifyRecruiter,

      getInternships,
      updateInternshipStatus,
      deleteInternship,
    }}
  >
    {children}
  </AdminContext.Provider>
);
}
