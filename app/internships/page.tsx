"use client";

import { useEffect, useState } from "react";
import {
  listInternships,
  InternshipApiItem,
  applyForInternship,
} from "@/lib/api";

export default function InternshipsPage() {
  const [internships, setInternships] = useState<InternshipApiItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await listInternships();
        setInternships(data.internships);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);
  const handleApply = async (internshipId: string) => {
  try {
    await applyForInternship({
      internshipId,
    });

    alert("Application submitted successfully!");
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Failed to apply.");
    }
  }
};

  return (
    <div className="p-10">
      <h1 className="mb-8 text-3xl font-bold">Internships</h1>

      <div className="grid gap-6">
        {internships.map((internship) => (
          <div
            key={internship._id}
            className="rounded-xl border p-6 shadow"
          >
            <h2 className="text-xl font-semibold">
              {internship.title}
            </h2>

            <p className="mt-2">{internship.description}</p>

            <p className="mt-3">
              📍 {internship.location}
            </p>

            <p>
              💰 ₹{internship.stipend}
            </p>

            <p>
              💼 {internship.workMode}
            </p>
           <button
  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
  onClick={() => handleApply(internship._id)}
>
  Apply Now
</button>
          </div>
        ))}
      </div>
    </div>
  );
}