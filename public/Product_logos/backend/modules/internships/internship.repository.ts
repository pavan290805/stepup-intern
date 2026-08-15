import { InternshipModel, type IInternship, type InternshipStatus } from "@/database/models/internship.model";
import type { CreateInternshipDto, UpdateInternshipDto } from "@/modules/internships/internship.validators";

export interface InternshipFilters {
  status?: InternshipStatus;
  location?: string;
  type?: string;
  skills?: string[];
  textQuery?: string;
  recruiterId?: string;
}

export const internshipRepository = {
  async create(recruiterId: string, data: CreateInternshipDto) {
    const internship = await InternshipModel.create({ ...data, recruiterId, status: "draft" });
    return internship.toObject();
  },

  async findById(id: string) {
    return InternshipModel.findById(id).lean().exec();
  },

  async findByIdAndRecruiter(id: string, recruiterId: string) {
    return InternshipModel.findOne({ _id: id, recruiterId }).lean().exec();
  },

  async update(id: string, data: UpdateInternshipDto) {
    return InternshipModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  },

  async updateStatus(id: string, status: InternshipStatus) {
    return InternshipModel.findByIdAndUpdate(id, { status }, { new: true }).lean().exec();
  },

  async delete(id: string) {
    return InternshipModel.findByIdAndDelete(id).lean().exec();
  },

  async incrementViewCount(id: string) {
    await InternshipModel.updateOne({ _id: id }, { $inc: { viewCount: 1 } }).exec();
  },

  async incrementApplicationCount(id: string, delta: 1 | -1) {
    await InternshipModel.updateOne({ _id: id }, { $inc: { applicationCount: delta } }).exec();
  },

  async search(filters: InternshipFilters, cursor: string | undefined, limit: number): Promise<IInternship[]> {
    const query: Record<string, unknown> = { status: filters.status ?? "published" };

    if (filters.location) query.location = { $regex: filters.location, $options: "i" };
    if (filters.type) query.type = filters.type;
    if (filters.skills && filters.skills.length > 0) query.skillsRequired = { $in: filters.skills };
    if (filters.recruiterId) query.recruiterId = filters.recruiterId;
    if (filters.textQuery) query.$text = { $search: filters.textQuery };
    if (cursor) query._id = { $lt: cursor };

    return InternshipModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findByRecruiter(recruiterId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { recruiterId };
    if (cursor) query._id = { $lt: cursor };

    return InternshipModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export type InternshipRepository = typeof internshipRepository;
