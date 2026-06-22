"use client";

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
import {
    loginUser,
    handleGoogleLogin,
    handleLinkedInLogin,
} from "../../Components/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Login() {
  const router = useRouter();
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    const loginData = {
      email: typeof email === "string" ? email : "",
      password: typeof password === "string" ? password : "",
    };

    await loginUser(loginData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-[#0880EF] text-white flex-col justify-center items-center p-10 relative">
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

        <div className="mb-8 flex items-center justify-center">
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

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <h1 className={sectionTitleStyles}>
            Welcome Back
          </h1>

          <p className={sectionSubtitleStyles}>
            Sign in to your StepUp account
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className={labelStyles}>
              Email Address
            </label>

            <input
              name="email"
              type="email"
              placeholder="arjun@example.com"
              className={inputStyles}
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className={labelStyles}>
              Password
            </label>

            <input
              name="password"
              type="password"
              placeholder="********"
              className={inputStyles}
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              className={`text-sm ${linkStyles}`}
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={primaryButtonStyles}
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>

            <span className="px-3 text-gray-400 text-sm">
              or
            </span>

            <div className="flex-1 border-t"></div>
          </div>

          {/* Google Login */}
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

          {/* LinkedIn Login */}
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

          {/* Signup Link */}
          <p className="text-center text-sm mt-6 text-black">
            Don't have an account?{" "}
            <button type="button"
              onClick={() => router.push("/signup")}
              className={linkStyles}
            >
              Create one
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}