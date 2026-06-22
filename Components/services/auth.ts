import {
  LoginData,
  StudentSignupData,
  RecruiterSignupData,
} from "../types/auth";

const BASE_URL = ""; // Backend URL later

export const loginUser = async (data: LoginData) => {
  console.log("Login Request");
  console.log(data);

  /*
  return await fetch(`${BASE_URL}/login`,{
      method:"POST",
      headers:{
          "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
  })
  */
};

export const signupStudent = async (
  data: StudentSignupData
) => {
  console.log("Student Signup");
  console.log(data);
};

export const signupRecruiter = async (
  data: RecruiterSignupData
) => {
  console.log("Recruiter Signup");
  console.log(data);
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