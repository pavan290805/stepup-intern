import { StudentProfileModel } from "@/database/models/student-profile.model";
import { ResumeModel } from "@/database/models/resume.model";
import type { UpsertStudentProfileDto } from "@/modules/students/student.validators";

export const studentRepository = {
  async findProfileByUserId(userId: string) {
    return StudentProfileModel.findOne({ userId }).lean().exec();
  },

  async upsertProfile(userId: string, data: UpsertStudentProfileDto) {
    return StudentProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();
  },

  async addResume(userId: string, resumeId: string) {
    return StudentProfileModel.findOneAndUpdate(
      { userId },
      { $addToSet: { resumeIds: resumeId }, $set: { activeResumeId: resumeId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();
  },

  async removeResume(userId: string, resumeId: string) {
    return StudentProfileModel.findOneAndUpdate(
      { userId },
      { $pull: { resumeIds: resumeId } },
      { new: true }
    )
      .lean()
      .exec();
  },

  async setActiveResume(userId: string, resumeId: string) {
    return StudentProfileModel.findOneAndUpdate({ userId }, { activeResumeId: resumeId }, { new: true })
      .lean()
      .exec();
  },

  async saveInternship(userId: string, internshipId: string) {
    return StudentProfileModel.findOneAndUpdate(
      { userId },
      { $addToSet: { savedInternshipIds: internshipId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();
  },

  async unsaveInternship(userId: string, internshipId: string) {
    return StudentProfileModel.findOneAndUpdate(
      { userId },
      { $pull: { savedInternshipIds: internshipId } },
      { new: true }
    )
      .lean()
      .exec();
  },

  async setResumeScore(userId: string, score: number) {
    return StudentProfileModel.findOneAndUpdate({ userId }, { resumeScore: score }, { new: true }).lean().exec();
  },
};

export const resumeRepository = {
  async create(studentId: string, data: { fileUrl: string; fileName: string; cloudinaryPublicId: string; version: number }) {
    const resume = await ResumeModel.create({ ...data, studentId });
    return resume.toObject();
  },

  async findById(id: string) {
    return ResumeModel.findById(id).lean().exec();
  },

  async findByStudent(studentId: string) {
    return ResumeModel.find({ studentId }).sort({ createdAt: -1 }).lean().exec();
  },

  async countByStudent(studentId: string): Promise<number> {
    return ResumeModel.countDocuments({ studentId }).exec();
  },

  async delete(id: string) {
    return ResumeModel.findByIdAndDelete(id).lean().exec();
  },

  async setAiAnalysis(id: string, analysis: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    analyzedAt: Date;
    provider: string;
  }) {
    return ResumeModel.findByIdAndUpdate(id, { aiAnalysis: analysis }, { new: true }).lean().exec();
  },
};

export type StudentRepository = typeof studentRepository;
export type ResumeRepository = typeof resumeRepository;
