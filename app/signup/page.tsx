"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

import {
  inputStyles,
  primaryButtonStyles,
  socialButtonStyles,
  sectionTitleStyles,
  sectionSubtitleStyles,
  labelStyles,
  linkStyles,
} from "../../Components/constants/styles";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerRecruiter, registerStudent } from "@/lib/api";

export default  function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isRecruiter = role === "recruiter";

  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
  ) => {
  event.preventDefault();
  setError("");
  setSuccess("");
  const form = event.currentTarget;
  const formData = new FormData(form);
  if(formData.get("password") !== formData.get("confirmPassword")){
        setError("Passwords do not match");
        return;
      }
  setLoading(true);
  try {
    
    if (role === "student") {
      const studentData = {
        name: formData.get("fullName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      await registerStudent(studentData);
      setSuccess("Student account created successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } else {
      
      const recruiterData = {
        name: formData.get("contactPersonName") as string,
        email: formData.get("personalEmail") as string,
        password: formData.get("password") as string,
      };
      await registerRecruiter(recruiterData);
      setSuccess("Recruiter account created successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      
    }

  } catch (error) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError("Something went wrong");
  }
  } finally {
    setLoading(false);
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

          <form ref={formRef} onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                if (role !== "student") {
                  setRole("student");
                  formRef.current?.reset();
                  setError("");
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }
              }}
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
                onClick={() => {
                if (role !== "recruiter") {
                  setRole("recruiter");
                  formRef.current?.reset();
                  setError("");
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }
              }}
                className={`border-2 rounded-lg py-3 font-semibold ${
                  role === "recruiter"
                    ? "border-[#0880EF] bg-blue-50 text-[#0880EF]"
                    : "border-gray-300 text-black"
                }`}
              >
                Recruiter
              </button>
            </div>

          

            {/* Full Name */}
            <div className="mb-4">
              <label className={labelStyles}>
                {isRecruiter ? "Contact Person Name" : "Full Name"}
              </label>

              <input
                type="text"
                name={isRecruiter ? "contactPersonName" : "fullName"}
                autoComplete="name"
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
                autoComplete="email"
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

            <div className="relative">
            <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
            placeholder="********"
            className={inputStyles}
            required
            />

           <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
              </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className={labelStyles}>
              Confirm Password
            </label>

            <div className="relative">
            <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="********"
            className={inputStyles}
            required
            />

           <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
              </div>
            
          </div>
          {error && (
          <p className="text-red-500 text-sm mb-3">
          {error}
          </p>
            )}
          {success && (
            <p className="text-green-600 text-sm mb-3">
              {success}
              </p>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${primaryButtonStyles} ${
              loading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
              {loading? "Creating Account...": 
              isRecruiter
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
            onClick={() => setError("Google signup is not connected yet.")}
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
  onClick={() => setError("LinkedIn signup is not connected yet.")}
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
