"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { COMPANY_SIZES } from "@/constants";
import { apiFetch } from "@/lib/api";

type SignupProps = {
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
};

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  industry: string;
  website: string;
  description: string;
  companySize: string;
  headquarters: string;
  designation: string;
  phoneNumber: string;
};

const initialFormValues: SignupFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  industry: "",
  website: "",
  description: "",
  companySize: COMPANY_SIZES[0],
  headquarters: "",
  designation: "",
  phoneNumber: "",
};

export default function Signup({ setShowSignup }: SignupProps) {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState<SignupFormValues>(initialFormValues);

  const isRecruiter = role === "recruiter";

  const updateField = (field: keyof SignupFormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const registerResponse = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          role,
        }),
      });

      if (registerResponse?.data?.accessToken) {
        localStorage.setItem("accessToken", registerResponse.data.accessToken);
      }

      if (isRecruiter) {
        const companyResponse = await apiFetch("/companies", {
          method: "POST",
          body: JSON.stringify({
            name: formValues.companyName,
            industry: formValues.industry,
            website: formValues.website,
            description: formValues.description,
            companySize: formValues.companySize,
            headquarters: formValues.headquarters,
          }),
        });

        await apiFetch("/recruiters/profile", {
          method: "POST",
          body: JSON.stringify({
            companyId: companyResponse?.data?._id || companyResponse?.data?.id,
            designation: formValues.designation,
            phoneNumber: formValues.phoneNumber,
          }),
        });
      }

      setShowSignup(false);
      router.push(isRecruiter ? "/recruiter/profile" : "/");
    } catch (error: any) {
      setErrorMessage(error.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden md:bg-[#0880EF]">
      <div className="hidden md:flex w-1/2 min-w-0 bg-[#0880EF] text-white flex-col justify-start items-center pt-12 p-10 relative md:sticky md:top-0 md:h-screen md:self-start overflow-hidden">
        <div className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold text-white">StepUp</h1>
          <h1 className="text-3xl font-bold text-black">Intern</h1>
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

          <h2 className="text-3xl font-bold mb-3">Launch your career today</h2>

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

          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label className="block mb-2 text-sm text-black">
                {isRecruiter ? "Contact Person Name" : "Full Name"}
              </label>
              <input
                name="name"
                type="text"
                value={formValues.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Arjun Kumar"
                className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-black">
                {isRecruiter ? "Personal Email Address" : "Email Address"}
              </label>
              <input
                name="email"
                type="email"
                value={formValues.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="arjun@example.com"
                className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-black">Password</label>
              <input
                name="password"
                type="password"
                value={formValues.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="********"
                className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-black">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formValues.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
                placeholder="********"
                className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
              />
            </div>

            {isRecruiter && (
              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-black">Company details</p>

                <div>
                  <label className="block mb-2 text-sm text-black">Company Name</label>
                  <input
                    name="companyName"
                    type="text"
                    value={formValues.companyName}
                    onChange={(event) => updateField("companyName", event.target.value)}
                    placeholder="StepUp Technologies Pvt. Ltd."
                    className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-black">Industry</label>
                  <input
                    name="industry"
                    type="text"
                    value={formValues.industry}
                    onChange={(event) => updateField("industry", event.target.value)}
                    placeholder="Software, Finance, Healthcare"
                    className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-black">Company Website</label>
                  <input
                    name="website"
                    type="url"
                    value={formValues.website}
                    onChange={(event) => updateField("website", event.target.value)}
                    placeholder="https://company.com"
                    className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-black">Company Description</label>
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Tell candidates what your company does."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-2 text-sm text-black">Company Size</label>
                    <select
                      name="companySize"
                      value={formValues.companySize}
                      onChange={(event) => updateField("companySize", event.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
                    >
                      {COMPANY_SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-black">Headquarters</label>
                    <input
                      name="headquarters"
                      type="text"
                      value={formValues.headquarters}
                      onChange={(event) => updateField("headquarters", event.target.value)}
                      placeholder="Bengaluru, India"
                      className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-2 text-sm text-black">Designation</label>
                    <input
                      name="designation"
                      type="text"
                      value={formValues.designation}
                      onChange={(event) => updateField("designation", event.target.value)}
                      placeholder="HR Manager"
                      className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-black">Phone Number</label>
                    <input
                      name="phoneNumber"
                      type="tel"
                      value={formValues.phoneNumber}
                      onChange={(event) => updateField("phoneNumber", event.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full border border-gray-300 rounded-lg p-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0880EF]"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0880EF] text-white py-3 rounded-lg font-semibold disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating account..."
                : isRecruiter
                  ? "Create Recruiter Account"
                  : "Create Student Account"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t"></div>
          </div>

          <button
            type="button"
            className="w-full border border-gray-300 py-2.5 rounded-lg text-black flex items-center justify-center gap-2"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

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