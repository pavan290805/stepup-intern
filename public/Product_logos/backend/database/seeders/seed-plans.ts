import "dotenv/config";
import mongoose from "mongoose";
import { env } from "@/config/env";
import { PlanModel } from "@/database/models/plan.model";
import { createModuleLogger } from "@/config/logger.config";

const logger = createModuleLogger("seed:plans");

const PLANS = [
  { key: "student-free", name: "Student Free", role: "student", tier: "free", priceInPaise: 0, billingCycle: null, features: ["Basic profile", "Limited applications", "2 resumes"] },
  { key: "student-premium", name: "Student Premium", role: "student", tier: "premium", priceInPaise: 29900, billingCycle: "monthly", features: ["Unlimited applications", "AI Resume Analyzer", "AI Career Mentor", "Unlimited resumes"] },
  { key: "recruiter-free", name: "Recruiter Free", role: "recruiter", tier: "free", priceInPaise: 0, billingCycle: null, features: ["Limited listings", "Basic applicant tracking"] },
  { key: "recruiter-premium", name: "Recruiter Premium", role: "recruiter", tier: "premium", priceInPaise: 199900, billingCycle: "monthly", features: ["Unlimited listings", "AI Candidate Ranking", "AI JD Generator", "Advanced analytics"] },
] as const;

async function seedPlans() {
  await mongoose.connect(env.MONGODB_URI);
  logger.info("Connected to MongoDB for plan seeding");

  for (const plan of PLANS) {
    await PlanModel.findOneAndUpdate({ key: plan.key }, plan, { upsert: true, new: true, setDefaultsOnInsert: true });
    logger.info({ key: plan.key }, "Seeded plan");
  }

  logger.info("Plan seeding complete");
  await mongoose.disconnect();
}

seedPlans().catch((error) => {
  logger.error({ err: error }, "Plan seed script failed");
  process.exit(1);
});
