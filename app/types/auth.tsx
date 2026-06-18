export interface LoginData {
  email: string;
  password: string;
}

export interface StudentSignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RecruiterSignupData {
  companyName: string;
  companyEmail: string;
  companyWebsite: string;
  industry: string;
  contactPersonName: string;
  personalEmail: string;
  password: string;
  confirmPassword: string;
}