import { ApplicationModel, type ApplicationStatus } from "@/database/models/application.model";

export interface CreateApplicationData {
  studentId: string;
  internshipId: string;
  recruiterId: string;
  resumeId: string;
  coverNote?: string;
}

export const applicationRepository = {
  async create(data: CreateApplicationData) {
    const application = await ApplicationModel.create({
      ...data,
      status: "applied",
      timeline: [{ status: "applied", changedAt: new Date(), note: null }],
    });
    return application.toObject();
  },

  async findExisting(studentId: string, internshipId: string) {
    return ApplicationModel.findOne({ studentId, internshipId }).lean().exec();
  },

  async findById(id: string) {
    return ApplicationModel.findById(id).lean().exec();
  },

  async findByStudent(studentId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { studentId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return ApplicationModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findByInternship(internshipId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { internshipId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return ApplicationModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async findByRecruiter(recruiterId: string, cursor: string | undefined, limit: number, status?: string) {
    const query: Record<string, unknown> = { recruiterId };
    if (status) query.status = status;
    if (cursor) query._id = { $lt: cursor };

    return ApplicationModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },

  async updateStatus(id: string, status: ApplicationStatus, note?: string) {
    return ApplicationModel.findByIdAndUpdate(
      id,
      {
        status,
        $push: { timeline: { status, changedAt: new Date(), note: note ?? null } },
      },
      { new: true }
    )
      .lean()
      .exec();
  },

  async countByInternship(internshipId: string): Promise<number> {
    return ApplicationModel.countDocuments({ internshipId }).exec();
  },

  async countByStudent(studentId: string): Promise<number> {
    return ApplicationModel.countDocuments({ studentId }).exec();
  },

  async countByRecruiter(recruiterId: string): Promise<number> {
    return ApplicationModel.countDocuments({ recruiterId }).exec();
  },
};

export type ApplicationRepository = typeof applicationRepository;
