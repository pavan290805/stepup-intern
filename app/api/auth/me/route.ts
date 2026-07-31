import { connectDB } from "@/lib/db";
import {
  errorResponse,
  successResponse,
  withAuth,
} from "@/middleware/auth";
import { authService } from "@/modules/auth/auth.service";
import { NextRequest } from "next/server";

type AuthenticatedRequest = NextRequest & {
  user: {
    userId: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    console.log("STEP 1");

    await connectDB();

    console.log("STEP 2");

    const authError = await withAuth(request);

    console.log("STEP 3", authError);

    if (authError) {
      console.log("RETURNING AUTH ERROR");
      return authError;
    }

    console.log("STEP 4");

    const user = (request as AuthenticatedRequest).user;

    console.log("USER =", user);

    const currentUser = await authService.getCurrentUser(
      user.userId
    );

    console.log("CURRENT USER =", currentUser);

    if (!currentUser) {
      return errorResponse(
        "User not found",
        undefined,
        404
      );
    }

    return successResponse(currentUser);
  } catch (error) {
    console.error("AUTH ME ERROR");
    console.error(error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unknown error",
      undefined,
      500
    );
  }
}