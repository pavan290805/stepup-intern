import { RecruiterProfileModel } from "@/database/models/recruiter-profile.model";
import { CompanyModel } from "@/database/models/company.model";
import { InterviewModel } from "@/database/models/interview.model";
import { slugify } from "@/shared/utils/slugify";
import { nanoid } from "nanoid";
import type { CreateCompanyDto, ScheduleInterviewDto, UpdateCompanyDto, UpsertRecruiterProfileDto } from "@/modules/recruiters/recruiter.validators";

export const recruiterRepository = {
  async findProfileByUserId(userId: string) {
    return RecruiterProfileModel.findOne({ userId }).lean().exec();
  },

  async upsertProfile(userId: string, data: UpsertRecruiterProfileDto) {
    return RecruiterProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();
  },

  async attachCompany(userId: string, companyId: string) {
    return RecruiterProfileModel.findOneAndUpdate({ userId }, { companyId }, { new: true }).lean().exec();
  },
};

export const companyRepository = {
  async create(createdBy: string, data: CreateCompanyDto) {
    const slug = `${slugify(data.name)}-${nanoid(6)}`;
    const company = await CompanyModel.create({ ...data, slug, createdBy });
    return company.toObject();
  },

  async findById(id: string) {
    return CompanyModel.findById(id).lean().exec();
  },

  async findByCreator(createdBy: string) {
    return CompanyModel.findOne({ createdBy }).lean().exec();
  },

  async update(id: string, data: UpdateCompanyDto) {
    return CompanyModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  },
};

export const interviewRepository = {
  async create(recruiterId: string, studentId: string, data: ScheduleInterviewDto) {
    const interview = await InterviewModel.create({ ...data, recruiterId, studentId });
    return interview.toObject();
  },

  async findByRecruiter(recruiterId: string) {
    return InterviewModel.find({ recruiterId }).sort({ scheduledAt: 1 }).lean().exec();
  },

  async findByApplicationId(applicationId: string) {
    return InterviewModel.findOne({ applicationId }).lean().exec();
  },

  async updateStatus(id: string, status: "scheduled" | "completed" | "cancelled") {
    return InterviewModel.findByIdAndUpdate(id, { status }, { new: true }).lean().exec();
  },
};

export type RecruiterRepository = typeof recruiterRepository;
