import { Schema, model, models, type Model } from "mongoose";

export const COMPANY_SIZE = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"] as const;
export type CompanySize = (typeof COMPANY_SIZE)[number];

export interface ICompany {
  name: string;
  slug: string;
  logoUrl: string | null;
  website: string | null;
  industry: string | null;
  size: CompanySize | null;
  description: string | null;
  verifiedByAdmin: boolean;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logoUrl: { type: String, default: null },
    website: { type: String, default: null },
    industry: { type: String, default: null },
    size: { type: String, enum: COMPANY_SIZE, default: null },
    description: { type: String, default: null },
    verifiedByAdmin: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

companySchema.index({ name: "text" });
companySchema.index({ slug: 1 }, { unique: true });

export const CompanyModel: Model<ICompany> = models.Company ?? model<ICompany>("Company", companySchema);
