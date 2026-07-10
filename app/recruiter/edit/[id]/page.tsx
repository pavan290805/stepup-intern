"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function EditInternshipPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const internshipId = params.id;

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const loadInternship = async () => {
      try {
        const response = await apiFetch(`/internships/${internshipId}`);
        const internship = response?.data;

        setTitle(internship?.title || "");
        setDuration(internship?.duration || "");
        setStipend(
          typeof internship?.stipend === "number" ? `₹${internship.stipend.toLocaleString()}` : ""
        );
        setDescription(internship?.description || "");
        setDeadline(
          internship?.deadline ? new Date(internship.deadline).toISOString().slice(0, 10) : ""
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (internshipId) {
      loadInternship();
    }
  }, [internshipId]);

  const handleSave = async () => {
    try {
      await apiFetch(`/internships/${internshipId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          duration,
          stipend: Number(stipend.replace(/[^\d]/g, "")) || 0,
          description,
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
        }),
      });

      router.push(`/recruiter/internships/${internshipId}`);
    } catch (error) {
      console.error(error);
    }
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