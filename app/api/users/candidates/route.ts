import { connectDB } from "@/lib/db";
import {userService} from "@/modules/user/user.service";

export async function GET() {
  try {
    await connectDB();
    const result = await userService.getCandidates();

    return new Response(
      JSON.stringify({
        success: true,
        count: result.count,
        users: result.users,
      },
      null,
      2
    ),
      { status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Get candidates error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch candidates",
      },
      null,
      2
    ),
      { status: 500,
        headers: {
          "Content-Type": "application/json",
        },
       }
    );
  }
}