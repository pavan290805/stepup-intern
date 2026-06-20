"use client";

import { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

const initialInterviews = [
  {
    id: 1,
    candidate: "Rahul Kumar",
    position: "Frontend Developer Intern",
    date: "25 Jun 2026",
    time: "10:00 AM",
    mode: "Online",
    status: "Scheduled",
  },
  {
    id: 2,
    candidate: "Priya Sharma",
    position: "UI/UX Designer Intern",
    date: "26 Jun 2026",
    time: "02:00 PM",
    mode: "Online",
    status: "Scheduled",
  },
  {
    id: 3,
    candidate: "John Doe",
    position: "AI/ML Intern",
    date: "28 Jun 2026",
    time: "11:30 AM",
    mode: "Offline",
    status: "Completed",
  },
];

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState(initialInterviews);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Interview Management
            </h1>

            <button
              className="bg-[#1E88E5] text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              + Schedule Interview
            </button>
          </div>

<div className="grid md:grid-cols-5 gap-6 mb-8">

  <div className="bg-white p-6 rounded-2xl shadow">
    <h3 className="text-gray-500">
      Total Interviews
    </h3>

    <p className="text-3xl font-bold text-[#1E88E5]">
      {interviews.length}
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <h3 className="text-gray-500">
      Scheduled
    </h3>

    <p className="text-3xl font-bold text-green-600">
      {
        interviews.filter(
          (i) => i.status === "Scheduled"
        ).length
      }
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <h3 className="text-gray-500">
      Completed
    </h3>

    <p className="text-3xl font-bold text-purple-600">
      {
        interviews.filter(
          (i) => i.status === "Completed"
        ).length
      }
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <h3 className="text-gray-500">
      Online Interviews
    </h3>

    <p className="text-3xl font-bold text-orange-500">
      {
        interviews.filter(
          (i) => i.mode === "Online"
        ).length
      }
    </p>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow">
    <h3 className="text-gray-500">
      Offline Interviews
    </h3>

    <p className="text-3xl font-bold text-indigo-600">
      {
        interviews.filter(
          (i) => i.mode === "Offline"
        ).length
      }
    </p>
  </div>

</div>

          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4">
                    Candidate
                  </th>
                  <th className="text-left p-4">
                    Position
                  </th>
                  <th className="text-left p-4">
                    Date
                  </th>
                  <th className="text-left p-4">
                    Time
                  </th>
                  <th className="text-left p-4">
                    Mode
                  </th>
                  <th className="text-left p-4">
                    Status
                  </th>
                  <th className="text-left p-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {interviews.map((interview) => (
                  <tr
                    key={interview.id}
                    className="border-t hover:bg-blue-50"
                  >
                    <td className="p-4">
                      {interview.candidate}
                    </td>

                    <td className="p-4">
                      {interview.position}
                    </td>

                    <td className="p-4">
                      {interview.date}
                    </td>

                    <td className="p-4">
                      {interview.time}
                    </td>

                    <td className="p-4">
                      {interview.mode}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          interview.status === "Scheduled"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {interview.status}
                      </span>
                    </td>
<td className="p-4">
  <div className="flex gap-2">

    <button
      className="bg-[#1E88E5] text-white px-3 py-2 rounded-lg hover:bg-blue-700"
    >
      View
    </button>

    <button
      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
    >
      Reschedule
    </button>

    <button
      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
      onClick={() =>
        setInterviews(
          interviews.filter(
            (i) => i.id !== interview.id
          )
        )
      }
    >
      Cancel
    </button>

  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}