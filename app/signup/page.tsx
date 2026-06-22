"use client";

import { useState } from "react";
import Image from "next/image";

import {
  inputStyles,
  primaryButtonStyles,
  socialButtonStyles,
  sectionTitleStyles,
  sectionSubtitleStyles,
  labelStyles,
  linkStyles,
} from "../../Components/constants/styles";
import{
signupStudent,
signupRecruiter,
handleGoogleLogin,
handleLinkedInLogin
} from "../../Components/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default  function Signup() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "recruiter">("student");

  const isRecruiter = role === "recruiter";

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

const form = event.currentTarget;
const formData = new FormData(form);

  try {
    if (role === "student") {
      if(formData.get("password") !== formData.get("confirmPassword")){
    alert("Passwords do not match");
    return;
      }
      const studentData = {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
      };


      await signupStudent(studentData);

    } else {

      const recruiterData = {
        companyName: formData.get("companyName") as string,
        companyEmail: formData.get("companyEmail") as string,
        companyWebsite: formData.get("companyWebsite") as string,
        industry: formData.get("industry") as string,
        contactPersonName: formData.get("contactPersonName") as string,
        personalEmail: formData.get("personalEmail") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
      };

      await signupRecruiter(recruiterData);
    }

  } catch (error) {
    console.error(error);
  }
};
  

  return (
    <div className="min-h-screen flex overflow-x-hidden md:bg-[#0880EF]">

      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 min-w-0 bg-[#0880EF] text-white flex-col justify-start items-center pt-12 p-10 relative md:sticky md:top-0 md:h-screen md:self-start overflow-hidden">

        <div className="absolute top-4 left-8">
          <Link href="/">
          <Image
              src="/StepUpLogo.png"
              alt="StepUp Logo"
              width={120}
              height={50}
              priority
            />
            </Link>
        </div>

        <div className="flex flex-1 w-full flex-col items-center justify-center text-center px-6">
          <div className="mb-10 flex justify-center">
            <Image
              src="/illustration_Image.png"
              alt="Career Illustration"
              width={420}
              height={420}
              priority
              className="object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Launch your career today
          </h2>

          <p className="text-center text-white/80 max-w-sm">
            Find internships that match your skills and ambitions.
          </p>

        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 min-w-0 bg-white flex justify-center items-center p-8">

        <div className="w-full max-w-md min-w-0">

          <h1 className={sectionTitleStyles}>
            {isRecruiter ? "Recruiter Sign Up" : "Student Sign Up"}
          </h1>

          <p className={sectionSubtitleStyles}>
            {isRecruiter
              ? "Register your company to post internships and find talent"
              : "Join StepUp and start your journey"}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`border-2 rounded-lg py-3 font-semibold ${
                  role === "student"
                    ? "border-[#0880EF] bg-blue-50 text-[#0880EF]"
                    : "border-gray-300 text-black"
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`border-2 rounded-lg py-3 font-semibold ${
                  role === "recruiter"
                    ? "border-[#0880EF] bg-blue-50 text-[#0880EF]"
                    : "border-gray-300 text-black"
                }`}
              >
                Recruiter
              </button>
            </div>

            {isRecruiter && (
              <div className="grid gap-4 mb-4 md:grid-cols-2">
                <div>
                  <label className={labelStyles}>
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    placeholder="StepUp Technologies Pvt. Ltd."
                    className={inputStyles}
                    required
                  />
                  </div>

                  <div>
                  <label className={labelStyles}>
                    Company Email
                  </label>

                  <input
                    type="email"
                    name="companyEmail"
                    placeholder="hr@company.com"
                    className={inputStyles}
                    required
                  />
                  </div>

                  <div>
                  <label className={labelStyles}>
                    Company Website
                  </label>

                  <input
                    type="url"
                    name="companyWebsite"
                    placeholder="https://company.com"
                    className={inputStyles}
                    required
                  />
                  </div>

                  <div>
                  <label className={labelStyles}>
                    Industry
                  </label>

                  <input
                    type="text"
                    name="industry"
                    placeholder="Software, Finance, Healthcare"
                    className={inputStyles}
                    required
                  />
                  </div>
                </div>
            )}

            {/* Full Name */}
            <div className="mb-4">
              <label className={labelStyles}>
                {isRecruiter ? "Contact Person Name" : "Full Name"}
              </label>

              <input
                type="text"
                name={isRecruiter ? "contactPersonName" : "fullName"}
                placeholder={isRecruiter ? "Arjun Kumar" : "Arjun Kumar"}
                className={inputStyles}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className={labelStyles}>
                {isRecruiter ? "Personal Email Address" : "Email Address"}
              </label>

              <input
                type="email"
                name={isRecruiter ? "personalEmail" : "email"}
                placeholder={isRecruiter ? "arjun@company.com" : "arjun@example.com"}
                className={inputStyles}
                required
              />
            </div>

          {/* Password */}
          <div className="mb-4">
            <label className={labelStyles}>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="********"
              className={inputStyles}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className={labelStyles}>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              className={inputStyles}
              required
            />
          </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className={primaryButtonStyles}
            >
              {isRecruiter
                ? "Create Recruiter Account"
                : "Create Student Account"}
            </button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-1 border-t"></div>

            <span className="px-3 text-gray-400 text-sm">
              or
            </span>

            <div className="flex-1 border-t"></div>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={socialButtonStyles}
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
            />

            Continue with Google
          </button>
          <button
  type="button"
  onClick={handleLinkedInLogin}
  className={`${socialButtonStyles} mt-3`}
>
  <Image
    src="/linkedinLogo.svg"
    alt="LinkedIn"
    width={20}
    height={20}
  />

  Continue with LinkedIn
</button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By creating an account, you agree to our
            Terms of Service and Privacy Policy.
          </p>

          {/* Sign In Link */}
          <p className="text-center text-sm mt-6 text-black">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className={linkStyles}
            >
              Sign In
            </span>
          </p>

        </div>

      </div>
    </div>
  );
}