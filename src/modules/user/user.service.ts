import User from "@/models/User";

class UserService {
  async getCandidates() {
    const candidates = await User.find({
      role: "student",
    })
      .select(
        "name email role isVerified isActive profilePicture createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    return {
      count: candidates.length,
      users: candidates,
    };
  }
}

export const userService = new UserService();