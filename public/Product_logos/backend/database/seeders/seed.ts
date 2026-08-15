import "dotenv/config";
import mongoose from "mongoose";
import { env } from "@/config/env";
import { UserModel } from "@/database/models/user.model";
import { SessionModel } from "@/database/models/session.model";
import { hashPassword } from "@/shared/utils/hash";
import { ALL_ROLES } from "@/shared/constants/roles";
import { createModuleLogger } from "@/config/logger.config";

const logger = createModuleLogger("seed");

const SEED_PASSWORD = "Seed@12345";

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  logger.info("Connected to MongoDB for seeding");

  await SessionModel.deleteMany({});
  await UserModel.deleteMany({ email: { $regex: /@stepup\.seed$/ } });

  const passwordHash = await hashPassword(SEED_PASSWORD);

  for (const role of ALL_ROLES) {
    const email = `${role.toLowerCase()}@stepup.seed`;
    await UserModel.create({
      email,
      passwordHash,
      role,
      status: "active",
      emailVerified: true,
    });
    logger.info({ email, role }, "Seeded user");
  }

  logger.info(
    { password: SEED_PASSWORD },
    "Seeding complete. All seed accounts share this password."
  );

  await mongoose.disconnect();
}

seed().catch((error) => {
  logger.error({ err: error }, "Seed script failed");
  process.exit(1);
});
