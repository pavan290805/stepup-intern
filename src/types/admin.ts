import type {
  CompanyApiItem,
  RecruiterProfileApi,
  InternshipApiItem,
} from "@/lib/api";


// ============================================
// Dashboard
// ============================================

export interface AdminStatistics {
  totalUsers: number;
  totalCompanies: number;
  totalInternships: number;
  totalApplications: number;
  studentCount: number;
  recruiterCount: number;
}

// ============================================
// Pagination
// ============================================

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}
// ============================================
// Users
// ============================================
export interface AdminUser {
  _id: string;

  name: string;

  email: string;

  role: "student" | "recruiter" | "admin";

  isVerified: boolean;

  isActive: boolean;

  profilePicture?: string;

  createdAt: string;

  updatedAt: string;
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

// ============================================
// Companies
// ============================================

export interface CompaniesResponse {
  companies: CompanyApiItem[];
  pagination: Pagination;
}


// ============================================
// Recruiters
// ============================================



export interface RecruitersResponse {
  recruiters: RecruiterProfileApi[];
  pagination: Pagination;
}

// ============================================
// Verification Actions
// ============================================

export interface VerificationActionRequest {
  action: "verify" | "reject";
}

// ============================================
// Internships
// ============================================


export interface InternshipsResponse {
  internships: InternshipApiItem[];
  pagination: Pagination;
}

export type InternshipStatus =
  | "draft"
  | "active"
  | "closed";

export interface UpdateInternshipStatusRequest {
  status: InternshipStatus;
}