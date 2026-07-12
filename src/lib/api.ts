type ApiEnvelope<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

function buildUrl(path: string) {
  return `${API_BASE}${path}`;
}

async function readPayload<T>(response: Response): Promise<ApiEnvelope<T> | null> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(buildUrl(path), {
    cache: "no-store",
    credentials: "include",
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
  });

  const payload = await readPayload<T>(response);

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    const errors = Array.isArray(payload?.errors) && payload?.errors.length > 0 ? `: ${payload?.errors.join(", ")}` : "";
    throw new Error(`${message}${errors}`);
  }

  return (payload?.data ?? payload) as T;
}

export const apiGet = <T,>(path: string) => apiRequest<T>(path);
export const apiPost = <T,>(path: string, body?: unknown) =>
  apiRequest<T>(path, { method: "POST", body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined });
export const apiPatch = <T,>(path: string, body?: unknown) =>
  apiRequest<T>(path, { method: "PATCH", body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined });
export const apiDelete = <T,>(path: string) => apiRequest<T>(path, { method: "DELETE" });

export type AuthUser = { id: string; name: string; email: string; role: "student" | "recruiter" | "admin" };
export type AuthResponse = { user: AuthUser; accessToken: string; refreshToken: string };

export type InternshipApiItem = {
  _id: string;
  id?: string;
  title: string;
  description: string;
  skillsRequired: string[];
  location: string;
  workMode: "remote" | "hybrid" | "onsite";
  stipend: number;
  duration: string;
  openings: number;
  deadline: string;
  featured: boolean;
  status: "draft" | "active" | "closed";
  views: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  companyId?: { _id?: string; name?: string; logoUrl?: string };
  recruiterId?: { _id?: string; designation?: string };
};

export type ApplicationApiItem = {
  _id: string;
  internshipId: InternshipApiItem | string;
  studentId:
    | {
        _id?: string;
        name?: string;
        email?: string;
        profilePicture?: string;
        userId?:
          | {
              name?: string;
              email?: string;
              profilePicture?: string;
            }
          | string;
      }
    | string;
  resumeUrl?: string;
  status: string;
  recruiterNotes?: string;
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type InterviewApiItem = {
  _id: string;
  applicationId:
    | ApplicationApiItem
    | string;
  scheduledAt: string;
  mode: "online" | "in_person" | "phone";
  meetingLink?: string;
  status: "scheduled" | "completed" | "cancelled";
  feedback?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type StudentProfileApi = {
  _id?: string;
  headline?: string;
  bio?: string;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }>;
  skills: string[];
  certifications: string[];
  achievements?: string[];
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description?: string;
  }>;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  profileCompletion: number;
  userId?: {
    name?: string;
    email?: string;
    profilePicture?: string;
  } | string;
};

export type RecruiterProfileApi = {
  _id?: string;
  userId?:
    | {
        name?: string;
        email?: string;
        profilePicture?: string;
      }
    | string;
  companyId?: { _id?: string; name?: string } | string;
  designation?: string;
  phoneNumber?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
  createdAt?: string;
  updatedAt?: string;
};

export type CompanyApiItem = {
  _id: string;
  name: string;
  industry: string;
  website: string;
  description: string;
  companySize: string;
  headquarters: string;
  logoUrl?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
};

export async function login(input: { email: string; password: string }) {
  return apiPost<AuthResponse>("/api/auth/login", input);
}

export async function registerStudent(input: { name: string; email: string; password: string }) {
  return apiPost<AuthResponse>("/api/auth/register", { ...input, role: "student" });
}

export async function registerRecruiter(input: { name: string; email: string; password: string }) {
  return apiPost<AuthResponse>("/api/auth/register", { ...input, role: "recruiter" });
}

export async function logout() {
  return apiPost<{ success: boolean }>("/api/auth/logout");
}

export async function getCurrentUser() {
  return apiGet<{
    id: string;
    name: string;
    email: string;
    role: "student" | "recruiter" | "admin";
    profilePicture?: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
  }>("/api/auth/me");
}

export async function listInternships(query = "page=1&limit=20") {
  return apiGet<{ internships: InternshipApiItem[]; pagination: { total: number; page: number; limit: number; pages: number } }>(
    `/api/internships?${query}`
  );
}

export async function getInternship(id: string) {
  return apiGet<InternshipApiItem>(`/api/internships/${id}`);
}

export async function createInternship(input: Record<string, unknown>) {
  return apiPost<InternshipApiItem>("/api/internships", input);
}

export async function updateInternship(id: string, input: Record<string, unknown>) {
  return apiPatch<InternshipApiItem>(`/api/internships/${id}`, input);
}

export async function deleteInternship(id: string) {
  return apiDelete<null>(`/api/internships/${id}`);
}

export async function listRecruiterInternships() {
  return apiGet<{ internships: InternshipApiItem[]; pagination: { total: number; page: number; limit: number; pages: number } }>(
    "/api/recruiters/internships?page=1&limit=100"
  );
}

export async function listInternshipApplications(internshipId: string) {
  return apiGet<{ applications: ApplicationApiItem[]; pagination: { total: number; page: number; limit: number; pages: number } }>(
    `/api/internships/${internshipId}/applications?page=1&limit=100`
  );
}

export async function listRecruiterInterviews() {
  return apiGet<{ interviews: InterviewApiItem[]; internships: InternshipApiItem[] }>("/api/recruiters/interviews");
}

export async function listStudentApplications() {
  return apiGet<{ applications: ApplicationApiItem[]; pagination: { total: number; page: number; limit: number; pages: number } }>(
    "/api/applications/my?page=1&limit=50"
  );
}

export async function applyForInternship(input: { internshipId: string; resumeUrl?: string }) {
  return apiPost<ApplicationApiItem>("/api/applications", input);
}

export async function updateApplication(id: string, input: { status: string; recruiterNotes?: string }) {
  return apiPatch<ApplicationApiItem>(`/api/applications/${id}`, input);
}

export async function deleteApplication(id: string) {
  return apiDelete<null>(`/api/applications/${id}`);
}

export async function scheduleInterview(input: { applicationId: string; scheduledAt: string; mode: "online" | "in_person" | "phone"; meetingLink?: string }) {
  return apiPost<InterviewApiItem>("/api/interviews", input);
}

export async function updateInterview(id: string, input: Partial<{ scheduledAt: string; mode: "online" | "in_person" | "phone"; meetingLink?: string; status: "scheduled" | "completed" | "cancelled"; feedback?: string; rating?: number }>) {
  return apiPatch<InterviewApiItem>(`/api/interviews/${id}`, input);
}

export async function getStudentProfile() {
  return apiGet<StudentProfileApi>("/api/students/profile");
}

export async function saveStudentProfile(input: Partial<StudentProfileApi>) {
  return apiPatch<StudentProfileApi>("/api/students/profile", input);
}

export async function createStudentProfile(input: Partial<StudentProfileApi>) {
  return apiPost<StudentProfileApi>("/api/students/profile", input);
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiPost<{ resumeUrl: string }>("/api/students/resume", formData);
}

export async function listSavedInternships() {
  return apiGet<{ internships: unknown[]; pagination: { total: number; page: number; limit: number; pages: number } }>(
    "/api/internships/saved?page=1&limit=50"
  );
}

export async function saveInternship(id: string) {
  return apiPost<unknown>("/api/internships/saved", { internshipId: id });
}

export async function unsaveInternship(id: string) {
  return apiDelete<null>(`/api/internships/saved/${id}`);
}

export async function checkSavedInternship(id: string) {
  return apiGet<{ isSaved: boolean }>(`/api/internships/saved/${id}`);
}

export async function getRecruiterProfile() {
  return apiGet<RecruiterProfileApi | null>("/api/recruiters/profile");
}

export async function updateRecruiterProfile(input: Partial<{ designation: string; phoneNumber: string }>) {
  return apiPatch<RecruiterProfileApi>("/api/recruiters/profile", input);
}

export async function getCompanies(query = "page=1&limit=20") {
  return apiGet<{ companies: CompanyApiItem[]; pagination: { total: number; page: number; limit: number; pages: number } }>(
    `/api/companies?${query}`
  );
}

export async function getNotifications() {
  return apiGet<{ notifications: unknown[]; unreadCount: number; pagination: { total: number; page: number; limit: number; pages: number } }>(
    "/api/notifications?page=1&limit=50"
  );
}
