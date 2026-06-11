"use client";
import Image from "next/image";

type SignupProps = {
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Signup({ setShowSignup }: SignupProps) {
  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-[#0880EF] text-white flex-col justify-center items-center p-10 relative">

        <div className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold text-white">
            StepUp
          </h1>
          <h1 className="text-3xl font-bold text-black">
            Intern
          </h1>
        </div>

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

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-8">

        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold text-black mb-2">
            Create Account
          </h1>

          <p className="text-gray-500 mb-6">
            Join StepUp and start your journey
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="
                border-2
                border-[#0880EF]
                bg-blue-50
                text-[#0880EF]
                rounded-lg
                py-3
                font-semibold
              "
            >
              Student
            </button>

            <button
              type="button"
              className="
                border
                border-gray-300
                rounded-lg
                py-3
                font-semibold
                text-black
              "
            >
              Recruiter
            </button>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm text-black">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Arjun Kumar"
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
              Email Address
            </label>

            <input
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

            {/* Password Strength */}
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Medium Strength
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block mb-2 text-sm text-black">
              Confirm Password
            </label>

            <input
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
            type="button"
            className="
              w-full
              bg-[#0880EF]
              text-white
              py-3
              rounded-lg
              font-semibold
            "
          >
            Create Account
          </button>

          <div className="flex items-center my-6">
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
              py-3
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