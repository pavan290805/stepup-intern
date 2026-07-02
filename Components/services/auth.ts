import {
  LoginData,
  StudentSignupData,
  RecruiterSignupData,
} from "../types/auth";

const BASE_URL =process.env.NEXT_PUBLIC_API_URL; // Backend URL later

export const loginUser = async (data: LoginData) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }
  return result;
};

export const signupStudent = async (
  data: StudentSignupData
) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      role: "student",
    }),
  });

  const result = await response.json();

if (!response.ok) {
  throw new Error(
    result.errors?.join(", ") ||
    result.message ||
    "Student signup failed"
  );
}

return result;
};

export const signupRecruiter = async (
  data: RecruiterSignupData
) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      role: "recruiter",
    }),
  });

  const result = await response.json();

if (!response.ok) {
  throw new Error(
    result.errors?.join(", ") ||
    result.message ||
    "Student signup failed"
  );
}

return result;
};

export const handleGoogleLogin = async () => {
  console.log("Google Login");

  /*
    window.location.href=`${BASE_URL}/auth/google`
  */
};

export const handleLinkedInLogin = async () => {
  console.log("LinkedIn Login");

  /*
    window.location.href=`${BASE_URL}/auth/linkedin`
  */
};