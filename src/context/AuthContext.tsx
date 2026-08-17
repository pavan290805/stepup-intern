"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  login as loginApi,
  registerStudent,
  registerRecruiter,
  logout as logoutApi,
  getCurrentUser,
  type AuthUser,
} from "@/lib/api";

import { useRouter } from "next/navigation";

import { onSessionExpired } from "@/lib/authEvents";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (input: {
    email: string;
    password: string;
  }) => Promise<AuthUser>;

  signupStudent: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthUser>;

  signupRecruiter: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthUser>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // ============================
  // State
  // ============================

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================
  // Derived State
  // ============================

  const isAuthenticated = user !== null;

  const router = useRouter();

  // ============================
  // Login
  // ============================

  const login = async (input: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await loginApi(input);

      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Student Signup
  // ============================

  const signupStudent = async (input: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await registerStudent(input);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Recruiter Signup
  // ============================

  const signupRecruiter = async (input: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await registerRecruiter(input);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Logout
  // ============================

  const logout = async () => {
    try {
      setLoading(true);

      await logoutApi();

      setUser(null);
      setError(null);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Restore Logged-in User
  // ============================

  const refreshUser = async () => {
    try {
      setLoading(true);

      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Run once when Provider mounts
  // ============================

  useEffect(() => {
    refreshUser();
  }, []);

 useEffect(() => {
  const unsubscribe = onSessionExpired(() => {
    setUser(null);
    setError(null);
    router.replace("/login");
  });

  return unsubscribe;
}, [router]);
  // ============================
  // Context Value
  // ============================

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signupStudent,
    signupRecruiter,
    logout,
    refreshUser,
  };

  // ============================
  // Provider
  // ============================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}