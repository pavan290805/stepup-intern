"use client";

import { useState } from "react";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home/Home";

import Login from "./Components/Login";
import Signup from "./Components/Signup";

export default function Page() {
  const [showAuth, setShowAuth] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowAuth(true);
    setShowSignup(false);
  };
  const openSignup = () => {
  setShowAuth(true);
  setShowSignup(true);
};

  return (
    <>
      <Navbar onLoginClick={openLogin} 
      onSignupClick={openSignup} />

      <Home onGetStarted={openSignup} />

      {showAuth && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            backdrop-blur-sm
            p-6
          "
        >
          <div
            className="
              relative
              w-full
              max-w-7xl
              max-h-[95vh]
              overflow-y-auto
            "
          >
            <button
              onClick={() => setShowAuth(false)}
              className="
                absolute
                top-5
                right-5
                z-50
                w-10
                h-10
                rounded-full
                bg-white
                text-2xl
                shadow-lg
                hover:bg-gray-100
              "
            >
              ×
            </button>

            {showSignup ? (
              <Signup setShowSignup={setShowSignup} />
            ) : (
              <Login setShowSignup={setShowSignup} />
            )}
          </div>
        </div>
      )}
    </>
  );
}