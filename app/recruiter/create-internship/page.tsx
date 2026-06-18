"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

export default function CreateInternship() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleCreateInternship = () => {
    if (
      !title ||
      !duration ||
      !stipend ||
      !skills ||
      !description ||
      !deadline
    ) {
      alert("Please fill all fields");
      return;
    }

    alert("Internship Created Successfully");

    setTitle("");
    setDuration("");
    setStipend("");
    setSkills("");
    setDescription("");
    setDeadline("");

    router.push("/recruiter/internships");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-gray-100">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Create Internship
          </h1>

          <div className="bg-white rounded-2xl shadow p-8">
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 font-medium">
                  Internship Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Frontend Developer Intern"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Duration
                </label>

                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="3 Months"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Stipend
                </label>

                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="₹10,000"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Skills Required
                </label>

                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Next.js"
                  className="w-full border rounded-xl p-3"
                />
              </div>

            </div>

            <div className="mt-6">
              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter internship description..."
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-medium">
                Application Deadline
              </label>

              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="border rounded-xl p-3"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateInternship}
                className="bg-[#1E88E5] text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Create Internship
              </button>

              <button
                onClick={() => router.push("/recruiter/internships")}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}