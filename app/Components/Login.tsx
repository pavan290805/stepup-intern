"use client";
import Image from "next/image";
type LoginProps = {
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({
  setShowSignup,
}: LoginProps) {
  return (
    <div className="min-h-screen flex">
      
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-[#0880EF] text-white flex-col justify-center items-center p-10">
    <div className="absolute top-8 left-8">
  <h1 className="text-2xl font-bold text-white">
    StepUp
  </h1>

  <h1 className="text-2xl font-bold text-white">
    Intern
  </h1>
</div>

        {/* Illustration Placeholder */}
        <div className=" bg-white/10 rounded-2xl mb-10 flex items-center justify-center">
          <Image
            src="/Illustration_Image.png"
            alt="Login Illustration"
            width={320}
            height={320}
            priority
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
            Welcome Back
          </h1>

          <p className="text-gray-500 mb-8">
            Sign in to your StepUp account
          </p>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-black">
              Email Address
            </label>

            <input
              type="email"
              placeholder="arjun@example.com"
              className="w-full border border-gray-300 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0880EF] placeholder:text-black/50"
            />
          </div>

          <div className="mb-2">
            <label className="block mb-2 text-sm text-black ">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full border border-gray-300 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#0880EF] placeholder:text-black/50"
            />
          </div>

          <div className="flex justify-end mb-6">
            <button
              type="button"
              className="text-sm text-[#0880EF]"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="button"
            className="w-full bg-[#0880EF] text-white py-3 rounded-lg font-semibold"
          >
            Sign In
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-gray-400 text-sm">
              or
            </span>
            <div className="flex-1 border-t"></div>
          </div>

          <button type="button" className="w-full border py-3 rounded-lg text-black flex items-center justify-center gap-2">
            <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}/>
            Continue with Google
        </button>

          <p className="text-center text-sm mt-6 text-black">
            Don't have an account?{" "}
            <span onClick={() => setShowSignup(true)} className="text-[#0880EF] cursor-pointer">
                Create one
            </span>
          </p>

        </div>

      </div>
    </div>
  );
}