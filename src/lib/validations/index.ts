import { z } from 'zod';

// Auth Validations
export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['student', 'recruiter', 'admin']),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Student Profile Validations
export const studentProfileSchema = z.object({
  headline: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  resumeUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  education: z
    .array(
      z.object({
        school: z.string(),
        degree: z.string(),
        field: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
      })
    )
    .optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
});

// Company Validations
export const companySchema = z.object({
  name: z.string().min(2).max(100),
  industry: z.string().max(50),
  website: z.string().url(),
  description: z.string().max(1000),
  companySize: z.string(),
  headquarters: z.string().max(100),
});

// Recruiter Profile Validations
export const recruiterProfileSchema = z.object({
  companyId: z.string(),
  designation: z.string().max(100),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
});

// Internship Validations
export const internshipSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  skillsRequired: z.array(z.string()),
  location: z.string().max(100),
  workMode: z.enum(['remote', 'hybrid', 'onsite']),
  stipend: z.number().min(0),
  duration: z.string(),
  openings: z.number().min(1),
  deadline: z.string().datetime(),
});

export const internshipFilterSchema = z.object({
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  stipend: z.object({ min: z.number().optional(), max: z.number().optional() }).optional(),
  workMode: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  company: z.string().optional(),
  status: z.enum(['draft', 'active', 'closed']).optional(),
  page: z.coerce.number().default(1),
limit: z.coerce.number().default(10),
});

// Application Validations
export const applicationSchema = z.object({
  internshipId: z.string(),
  resumeUrl: z.string().url().optional(),
});

export const applicationStatusUpdateSchema = z.object({
  status: z.enum([
    'applied',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'selected',
    'rejected',
    'withdrawn',
  ]),
  recruiterNotes: z.string().optional(),
});

// Interview Validations
export const interviewSchema = z.object({
  applicationId: z.string(),
  scheduledAt: z.string().datetime(),
  mode: z.enum(['online', 'in_person', 'phone']),
  meetingLink: z.string().url().optional(),
});

export const interviewUpdateSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  mode: z.enum(['online', 'in_person', 'phone']).optional(),
  meetingLink: z.string().url().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  feedback: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

// Saved Internship Validations
export const savedInternshipSchema = z.object({
  internshipId: z.string(),
});

// Query Validations
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type RecruiterProfileInput = z.infer<typeof recruiterProfileSchema>;
export type InternshipInput = z.infer<typeof internshipSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type InterviewInput = z.infer<typeof interviewSchema>;
