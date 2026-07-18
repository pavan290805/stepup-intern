export const USER_ROLES = {
  STUDENT: 'student',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
} as const;

export const INTERNSHIP_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
} as const;

export const WORK_MODES = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onsite',
} as const;

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'under_review',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  SELECTED: 'selected',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export const INTERVIEW_MODES = {
  ONLINE: 'online',
  IN_PERSON: 'in_person',
  PHONE: 'phone',
} as const;

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const NOTIFICATION_TYPES = {
  APPLICATION_RECEIVED: 'application_received',
  APPLICATION_STATUS: 'application_status',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERNSHIP_POSTED: 'internship_posted',
  PROFILE_UPDATE: 'profile_update',
} as const;

export const COMPANY_SIZES = [
  '1-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || '15m';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRE || '7d';
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880');
