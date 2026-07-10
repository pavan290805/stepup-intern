"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Navbar from "../../../Components/Navbar";

const initialApplicants = [
  {
    id: 1,
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    status: "Applied",
    university: "IIT Hyderabad",
    gpa: "4.0",
    resume:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@gmail.com",
    phone: "+91 9988776655",
    status: "Shortlisted",
    university: "NIT Warangal",
    gpa: "3.9",
    resume:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 3,
    name: "Alex Rivera",
    email: "alex@gmail.com",
    phone: "+91 9876501234",
    status: "Applied",
    university: "BITS Pilani",
    gpa: "3.8",
    resume:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

const initialInternshipDetails = {
  title: "Frontend Developer Intern",
  company: "StepUp Intern",
  id: "#JB-10294",
  publishedOn: "June 12, 2024",
  location: "Hyderabad, India",
  stipend: "₹10,000 /mo",
  deadline: "26 Jun 2026",
  duration: "3 Months",
  totalViews: "1,402",
  overview:
    "Join our core product team to build the future of recruitment tech. As a Frontend Developer Intern, you will be mentored by senior engineers to build responsive, high-performance web applications. You'll contribute to our internal UI library and help implement complex data visualization components.",
  responsibilities: [
    "Collaborate with product designers to implement pixel-perfect UIs.",
    "Optimize web pages for maximum speed and scalability.",
    "Participate in code reviews and team stand-ups.",
  ],
  skills: ["React.js", "Tailwind CSS", "TypeScript", "Redux/Zustand", "Figma to Code"],
};

export default function InternshipDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const internshipId = params.id;

  const [applicants, setApplicants] = useState(initialApplicants);
  const [internshipDetails, setInternshipDetails] = useState(initialInternshipDetails);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [showResume, setShowResume] = useState(false);
  const [selectedResume, setSelectedResume] = useState("");

  useEffect(() => {
    const loadInternship = async () => {
      try {
        console.log("Internship ID:", internshipId);
        const internshipResponse = await apiFetch(`/internships/${internshipId}`);
        const internship = internshipResponse?.data;

        setInternshipDetails({
          title: internship?.title || initialInternshipDetails.title,
          company: internship?.companyId?.name || initialInternshipDetails.company,
          id: internship?._id ? `#${String(internship._id).slice(-6).toUpperCase()}` : initialInternshipDetails.id,
          publishedOn: internship?.createdAt
            ? new Date(internship.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })
            : initialInternshipDetails.publishedOn,
          location: internship?.location || initialInternshipDetails.location,
          stipend: typeof internship?.stipend === "number" ? `₹${internship.stipend.toLocaleString()} /mo` : initialInternshipDetails.stipend,
          deadline: internship?.deadline
            ? new Date(internship.deadline).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })
            : initialInternshipDetails.deadline,
          duration: internship?.duration || initialInternshipDetails.duration,
          totalViews: Intl.NumberFormat("en-US").format(internship?.views || 0),
          overview: internship?.description || initialInternshipDetails.overview,
          responsibilities: initialInternshipDetails.responsibilities,
          skills: internship?.skillsRequired?.length ? internship.skillsRequired : initialInternshipDetails.skills,
        });

        const applicantsResponse = await apiFetch(`/applications?internshipId=${internshipId}&limit=50`);
        const backendApplicants = applicantsResponse?.data?.applications || [];

        setApplicants(
          backendApplicants.map((application: any) => {
            const studentUser = application.studentId?.userId;
            const applicantName = studentUser?.name || studentUser?.email || "Applicant";

            return {
              id: application._id,
              name: applicantName,
              email: studentUser?.email || "",
              phone: studentUser?.phoneNumber || "",
              status:
                application.status === "shortlisted"
                  ? "Shortlisted"
                  : application.status === "interview_scheduled"
                    ? "Interview Scheduled"
                    : application.status === "rejected"
                      ? "Rejected"
                      : "Applied",
              university: application.studentId?.education?.[0]?.school || "Student Profile",
              gpa: `${application.studentId?.profileCompletion || 0}% Complete`,
              resume: application.studentId?.resumeUrl || "",
            };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (internshipId) {
      loadInternship();
    }
  }, [internshipId]);

  const totalApplicants = applicants.length;
  const shortlisted = applicants.filter((a) => a.status === "Shortlisted").length;
  const interviews = applicants.filter((a) => a.status === "Interview Scheduled").length;
  const rejected = applicants.filter((a) => a.status === "Rejected").length;

  const confirmInterview = async () => {
    if (!selectedApplicant || !interviewDate || !interviewTime) {
      return;
    }

    try {
      await apiFetch("/interviews", {
        method: "POST",
        body: JSON.stringify({
          applicationId: selectedApplicant.id,
          scheduledAt: new Date(`${interviewDate}T${interviewTime}`).toISOString(),
          mode: "online",
        }),
      });

      setApplicants((prev) =>
        prev.map((a) =>
          a.id === selectedApplicant.id
            ? { ...a, status: "Interview Scheduled", interviewDate, interviewTime }
            : a
        )
      );
      setShowInterviewModal(false);
      setInterviewDate("");
      setInterviewTime("");
    } catch (error) {
      console.error(error);
    }
  };

  const avatarColors: Record<string, string> = {
    "Rahul Kumar": "bg-blue-500",
    "Priya Sharma": "bg-green-500",
    "Alex Rivera": "bg-purple-500",
  };

  const handleEdit = () => {
    router.push(`/recruiter/edit/${internshipId}`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFeatureListing = () => {
    router.push("/recruiter/analytics");
  };

  const handleViewFullReport = () => {
    router.push("/recruiter/analytics");
  };

  const handleReviewPipeline = () => {
    router.push("/recruiter/interviews");
  };

  const handleViewArchive = () => {
    router.push("/recruiter");
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col font-sans">

      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-7 flex-1 w-full">

        {/* Breadcrumb */}
        <p className="text-xs text-gray-400 mb-2">
          <span className="hover:underline cursor-pointer">Dashboard</span>
          {" › "}
          <span className="hover:underline cursor-pointer">Listings</span>
          {" › "}
          <span className="text-blue-500 hover:underline cursor-pointer">Frontend Developer Intern</span>
        </p>

        {/* Title Row */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{internshipDetails.title}</h1>
            <p className="text-xs text-gray-400 mt-1">
              Published on{" "}
              <span className="text-blue-500">{internshipDetails.publishedOn}</span>
              {" • ID: "}
              <span className="text-gray-500">{internshipDetails.id}</span>
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <button onClick={handleEdit} className="flex items-center gap-1 border border-gray-300 bg-white px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              ✏️ Edit
            </button>
            <button onClick={handleShare} className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-800">
              ↗ Share
            </button>
            <button onClick={handleFeatureListing} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">
              ⭐ Feature Listing
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mt-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Total Applicants</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{totalApplicants}</span>
              <span className="text-xs text-green-500 mb-1">▲ 12%</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Shortlisted</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{shortlisted}</span>
              <span className="text-xs text-gray-400 mb-1">38% Rate</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Interviews</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{interviews}</span>
              <span className="text-xs text-green-500 mb-1">ACTIVE</span>
            </div>
          </div>

          <div className="bg-white border border-l-4 border-l-red-400 border-gray-200 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Rejected</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">{rejected}</span>
              <span className="text-xs text-gray-400 mb-1">11% Rate</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">

            {/* Role Deep-Dive Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-blue-500 text-lg">📄</span>
                <h2 className="text-lg font-bold text-gray-900">Role Deep-Dive</h2>
              </div>

              {/* Position Overview */}
              <p className="text-[10px] uppercase tracking-widest text-orange-500 font-semibold mb-2">
                Position Overview
              </p>
              <p className="text-gray-600 text-sm leading-7 mb-6">
                {internshipDetails.overview}
              </p>

              {/* Required Skillset */}
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">
                Required Skillset
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {internshipDetails.skills.map((skill) => (
                  <span
                    key={skill}
                    className="border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs bg-gray-50 flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
                    {skill}
                  </span>
                ))}
              </div>

              {/* Key Responsibilities */}
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">
                Key Responsibilities
              </p>
              <ul className="space-y-2">
                {internshipDetails.responsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-blue-600">
                    <span className="mt-0.5 text-blue-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Two Cards */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-500">🏢</span>
                  <h3 className="font-bold text-gray-900">Engineering Culture</h3>
                </div>
                <p className="text-gray-500 text-sm leading-6">
                  We ship fast and maintain high quality. Our frontend stack is modern, our PR reviews are
                  constructive, and our component library is rigorous.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-500">📍</span>
                  <h3 className="font-bold text-gray-900">Location</h3>
                </div>
                <p className="text-gray-500 text-sm mb-3">
                  Hyderabad • Hybrid
                </p>
                {/* Map placeholder */}
                <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 text-xs">
                    🗺 Map View
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* Listing Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Listing Summary</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-400 text-sm flex items-center gap-2">💰 Stipend</span>
                  <span className="font-bold text-gray-900">{internshipDetails.stipend}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-400 text-sm flex items-center gap-2">🕒 Duration</span>
                  <span className="font-semibold text-gray-900">{internshipDetails.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-400 text-sm flex items-center gap-2">📅 Deadline</span>
                  <span className="font-semibold text-blue-600">{internshipDetails.deadline}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">👁 Total Views</span>
                  <span className="font-bold text-gray-900">{internshipDetails.totalViews}</span>
                </div>
              </div>

              <button onClick={handleViewFullReport} className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                📊 View Full Report
              </button>
            </div>

            {/* New Applicants */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-900">New Applicants</h3>
                <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {totalApplicants} NEW
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {applicants.slice(0, 3).map((applicant) => (
                  <div key={applicant.id} className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0 ${
                        avatarColors[applicant.name] ?? "bg-gray-400"
                      }`}
                    >
                      {applicant.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 leading-tight">{applicant.name}</p>
                      <p className="text-xs text-gray-400">{applicant.university} • {applicant.gpa} GPA</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleReviewPipeline} className="w-full border border-blue-600 text-blue-600 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-50 flex items-center justify-center gap-2">
                Review Pipeline 👥
              </button>

              <p onClick={handleViewArchive} className="text-center text-xs text-gray-400 mt-3 hover:text-blue-500 cursor-pointer">
                View Archive
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">S</span>
            <div>
              <p className="text-sm font-bold text-gray-900">StepUp Intern</p>
              <p className="text-xs text-gray-400">
                © 2024{" "}
                <span className="text-blue-500">StepUp Recruitment Solutions</span>
              </p>
            </div>
          </div>
          <div className="flex gap-5 text-xs text-gray-400">
            <span className="hover:text-blue-500 cursor-pointer">Privacy</span>
            <span className="hover:text-blue-500 cursor-pointer">Terms</span>
            <span className="hover:text-blue-500 cursor-pointer">Help Center</span>
            <span className="hover:text-blue-500 cursor-pointer">System Status</span>
          </div>
        </div>
      </footer>

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[450px]">
            <h2 className="text-2xl font-bold mb-5">Schedule Interview</h2>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />
            <input
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              className="w-full border rounded-lg p-3 mb-5"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmInterview}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {showResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[95%] h-[90vh] rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-semibold">Resume Preview</h2>
              <button onClick={() => setShowResume(false)} className="text-2xl">×</button>
            </div>
            <iframe src={selectedResume} className="w-full h-[75vh]" />
            <div className="p-5 border-t flex justify-end gap-3">
              <a href={selectedResume} download className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                Download Resume
              </a>
              <button onClick={() => setShowResume(false)} className="border px-5 py-2 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}