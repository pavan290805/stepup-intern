"use client";

import { useState } from "react";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

  return showSignup ? (
    <Signup setShowSignup={setShowSignup} />
  ) : (
    <Login setShowSignup={setShowSignup} />
  );
}