"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signupRecruiter, signupStudent } from "../../src/modules/auth/auth.client";

type SignupProps = {
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Signup({ setShowSignup }: SignupProps) {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [error, setError] = useState("");

  const isRecruiter = role === "recruiter";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      password,
      ...(isRecruiter
        ? {
            companyName: String(formData.get("companyName") || "").trim(),
            companyEmail: String(formData.get("companyEmail") || "").trim(),
            companyWebsite: String(formData.get("companyWebsite") || "").trim(),
            industry: String(formData.get("industry") || "").trim(),
          }
        : {}),
    };

    try {
      const result = isRecruiter
        ? await signupRecruiter(payload)
        : await signupStudent(payload);

      if (result.user.role === "recruiter") {
        window.location.replace("/recruiter");
        return;
      }

      window.location.replace("/internships");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden md:bg-[#0880EF]">

      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 min-w-0 bg-[#0880EF] text-white flex-col justify-start items-center pt-12 p-10 relative md:sticky md:top-0 md:h-screen md:self-start overflow-hidden">

        <div className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold text-white">
            StepUp
          </h1>
          <h1 className="text-3xl font-bold text-black">
            Intern
          </h1>
        </div>

        <div className="flex flex-1 w-full flex-col items-center justify-center text-center px-6">
          <div className="mb-10 flex justify-center">
            <Image
              src="/Illustration_Image.png"
              alt="Illustration"
              width={320}
              height={250}
              priority
              className="object-contain opacity-90"
            />
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Launch your career today
          </h2>

          <p className="text-center text-white/80 max-w-sm">
            Find internships that match your skills and ambitions.
          </p>

          <div className="flex gap-4 mt-10">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="font-bold">50K+</p>
              <p className="text-sm">Students</p>
            </div>

            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="font-bold">5K+</p>
              <p className="text-sm">Companies</p>
            </div>

            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="font-bold">200+</p>
              <p className="text-sm">Cities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 min-w-0 bg-white flex justify-center items-center p-8">

        <div className="w-full max-w-md min-w-0">

          <h1 className="text-3xl font-bold text-black mb-2">
            {isRecruiter ? "Recruiter Sign Up" : "Student Sign Up"}
          </h1>

          <p className="text-gray-500 mb-6">
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
                  <label className="block mb-2 text-sm text-black">
                    Company Name
                  </label>

                  <input
                    name="companyName"
                    type="text"
                    placeholder="StepUp Technologies Pvt. Ltd."
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      p-3
                      text-black
                      placeholder:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#0880EF]
                    "
                  />
                  </div>

                  <div>
                  <label className="block mb-2 text-sm text-black">
                    Company Email
                  </label>

                  <input
                    name="companyEmail"
                    type="email"
                    placeholder="hr@company.com"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      p-3
                      text-black
                      placeholder:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#0880EF]
                    "
                  />
                  </div>

                  <div>
                  <label className="block mb-2 text-sm text-black">
                    Company Website
                  </label>

                  <input
                    name="companyWebsite"
                    type="url"
                    placeholder="https://company.com"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      p-3
                      text-black
                      placeholder:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#0880EF]
                    "
                  />
                  </div>

                  <div>
                  <label className="block mb-2 text-sm text-black">
                    Industry
                  </label>

                  <input
                    name="industry"
                    type="text"
                    placeholder="Software, Finance, Healthcare"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      p-3
                      text-black
                      placeholder:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#0880EF]
                    "
                  />
                  </div>
                </div>
            )}

            {/* Full Name */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-black">
                {isRecruiter ? "Contact Person Name" : "Full Name"}
              </label>

              <input
                name="name"
                type="text"
                placeholder={isRecruiter ? "Arjun Kumar" : "Arjun Kumar"}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  p-3
                  text-black
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0880EF]
                "
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-2 text-sm text-black">
                {isRecruiter ? "Personal Email Address" : "Email Address"}
              </label>

              <input
                name="email"
                type="email"
                placeholder="arjun@example.com"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  p-3
                  text-black
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#0880EF]
                "
              />
            </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-2 text-sm text-black">
              Password
            </label>

            <input
              name="password"
              type="password"
              placeholder="********"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                p-3
                text-black
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-[#0880EF]
              "
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block mb-2 text-sm text-black">
              Confirm Password
            </label>

            <input
              name="confirmPassword"
              type="password"
              placeholder="********"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                p-3
                text-black
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-[#0880EF]
              "
            />
          </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="
                w-full
                bg-[#0880EF]
                text-white
                py-3
                rounded-lg
                font-semibold
              "
            >
              {isRecruiter
                ? "Create Recruiter Account"
                : "Create Student Account"}
            </button>
          </form>

          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
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
            className="
              w-full
              border
              border-gray-300
              py-2.5
              rounded-lg
              text-black
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
            />

            Continue with Google
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
              onClick={() => setShowSignup(false)}
              className="text-[#0880EF] cursor-pointer"
            >
              Sign In
            </span>
          </p>

        </div>

      </div>
    </div>
  );
}