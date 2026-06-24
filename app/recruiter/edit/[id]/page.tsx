"use client";

import { useState } from "react";
import Navbar from "../../../Components/Navbar";

export default function EditInternshipPage() {
  const [title, setTitle] =
    useState("Frontend Developer Intern");

  const [duration, setDuration] =
    useState("3 Months");

  const [stipend, setStipend] =
    useState("₹10,000");

  const [description, setDescription] =
    useState(
      "We are looking for a talented Frontend Developer Intern to join our team."
    );

  const [deadline, setDeadline] =
    useState("2026-06-26");

  const handleSave = () => {
    alert("Internship Updated Successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">

      <div className="bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-sm">

        <h1 className="text-3xl font-bold mb-6">
          Edit Internship
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Internship Title"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            placeholder="Duration"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            value={stipend}
            onChange={(e) =>
              setStipend(e.target.value)
            }
            placeholder="Stipend"
            className="w-full border rounded-lg p-3"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={5}
            placeholder="Description"
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}