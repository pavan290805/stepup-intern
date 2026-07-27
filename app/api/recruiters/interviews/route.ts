import { USER_ROLES } from "@/constants";
import { connectDB } from "@/lib/db";
import { errorResponse, successResponse, withAuth } from "@/middleware/auth";
import Application from "@/models/Application";
import Interview from "@/models/Interview";
import Internship from "@/models/Internship";
import { NextRequest } from "next/server";
import RecruiterProfile from "@/models/RecruiterProfile";
type AuthenticatedRequest = NextRequest & {
  user: {
    userId: string;
    role: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authError = await withAuth(request, [USER_ROLES.RECRUITER]);
    if (authError) return authError;

    const user = (request as AuthenticatedRequest).user;
    console.log("Logged in user:", user);

    // Fetch all internships created by this recruiter
    const recruiterProfile = await RecruiterProfile.findOne({
  userId: user.userId,
});

if (!recruiterProfile) {
  return successResponse({
    interviews: [],
    internships: [],
  });
}


const internships = await Internship.find({
  recruiterId: recruiterProfile._id,
}).lean();
    console.log("Recruiter ID:", user.userId);
console.log("Internships found:", internships.length);
console.log("Internships:", internships);
    

    if (internships.length === 0) {
      return successResponse({
        interviews: [],
        internships: [],
      });
    }

    const internshipIds = internships.map((i) => i._id);

    // Fetch applications for those internships
    const applications = await Application.find({
      internshipId: { $in: internshipIds },
    }).select("_id");

    const applicationIds = applications.map((a) => a._id);

    // Fetch interviews
    const interviews = await Interview.find({
      applicationId: { $in: applicationIds },
    })
.populate({
  path: "applicationId",
  populate: [
    {
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email profilePicture",
      },
    },
    {
      path: "internshipId",
      select: "title",
    },
  ],
})      .sort({ scheduledAt: 1 });

    return successResponse({
      interviews,
      internships,
    });
  } catch (error: unknown) {
    console.error("Recruiter Interviews Error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to fetch recruiter interviews",
      undefined,
      500
    );
  }
}