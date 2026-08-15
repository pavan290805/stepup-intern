import { studentRepository, resumeRepository } from "@/modules/students/student.repository";
import { applicationService } from "@/modules/applications/application.service";
import { uploadService } from "@/storage/upload.service";
import { resumeAnalyzerService } from "@/ai/services/resume-analyzer.service";
import { ForbiddenError, NotFoundError } from "@/shared/errors";
import { createModuleLogger } from "@/config/logger.config";
import type { IncomingFile } from "@/storage/validators/file-validation";
import type { UpsertStudentProfileDto } from "@/modules/students/student.validators";

const logger = createModuleLogger("student.service");

const FREE_TIER_RESUME_LIMIT = 2;

export const studentService = {
  async getProfile(userId: string) {
    const profile = await studentRepository.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Student profile not found. Complete your profile first.");
    }
    return profile;
  },

  async upsertProfile(userId: string, data: UpsertStudentProfileDto) {
    return studentRepository.upsertProfile(userId, data);
  },

  async uploadResume(userId: string, fileBuffer: Buffer, meta: IncomingFile) {
    const profile = await studentRepository.findProfileByUserId(userId);
    const existingCount = await resumeRepository.countByStudent(userId);

    if (profile?.subscriptionTier !== "premium" && existingCount >= FREE_TIER_RESUME_LIMIT) {
      throw new ForbiddenError(
        `Free plan is limited to ${FREE_TIER_RESUME_LIMIT} resumes. Upgrade to Premium for unlimited resumes.`
      );
    }

    const uploadResult = await uploadService.uploadResume(fileBuffer, meta, userId);

    const resume = await resumeRepository.create(userId, {
      fileUrl: uploadResult.url,
      fileName: meta.fileName,
      cloudinaryPublicId: uploadResult.publicId,
      version: existingCount + 1,
    });

    await studentRepository.addResume(userId, String(resume._id));
    logger.info({ userId, resumeId: String(resume._id) }, "Resume uploaded");

    return resume;
  },

  async listResumes(userId: string) {
    return resumeRepository.findByStudent(userId);
  },

  async deleteResume(userId: string, resumeId: string) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume || String(resume.studentId) !== userId) {
      throw new NotFoundError("Resume not found");
    }

    await uploadService.deleteAsset(resume.cloudinaryPublicId);
    await resumeRepository.delete(resumeId);
    await studentRepository.removeResume(userId, resumeId);

    return { deleted: true };
  },

  async setActiveResume(userId: string, resumeId: string) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume || String(resume.studentId) !== userId) {
      throw new NotFoundError("Resume not found");
    }
    return studentRepository.setActiveResume(userId, resumeId);
  },

  async saveInternship(userId: string, internshipId: string) {
    return studentRepository.saveInternship(userId, internshipId);
  },

  async analyzeResume(userId: string, resumeId: string | undefined, resumeText: string | undefined, targetRole?: string) {
    let textToAnalyze = resumeText;
    let targetResumeId = resumeId;

    if (!textToAnalyze && resumeId) {
      const resume = await resumeRepository.findById(resumeId);
      if (!resume || String(resume.studentId) !== userId) {
        throw new NotFoundError("Resume not found");
      }
      if (!resume.parsedText) {
        throw new NotFoundError(
          "This resume has no extracted text yet. Provide resumeText directly, or wait for parsing to complete."
        );
      }
      textToAnalyze = resume.parsedText;
      targetResumeId = String(resume._id);
    }

    if (!textToAnalyze) {
      throw new NotFoundError("No resume text available to analyze");
    }

    const analysis = await resumeAnalyzerService.analyze(textToAnalyze, targetRole);

    if (targetResumeId) {
      await resumeRepository.setAiAnalysis(targetResumeId, {
        score: analysis.score,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        analyzedAt: new Date(),
        provider: analysis.provider,
      });
      await studentRepository.setResumeScore(userId, analysis.score);
    }

    logger.info({ userId, resumeId: targetResumeId, score: analysis.score }, "Resume analyzed by AI");

    return analysis;
  },

  async unsaveInternship(userId: string, internshipId: string) {
    return studentRepository.unsaveInternship(userId, internshipId);
  },

  async getSavedInternships(userId: string) {
    const profile = await studentRepository.findProfileByUserId(userId);
    return profile?.savedInternshipIds ?? [];
  },

  async getDashboard(userId: string) {
    const [profile, resumes, applications] = await Promise.all([
      studentRepository.findProfileByUserId(userId),
      resumeRepository.findByStudent(userId),
      applicationService.getHistoryForStudent(userId, undefined, 100),
    ]);

    if (!profile) {
      throw new NotFoundError("Student profile not found. Complete your profile first.");
    }

    const statusCounts = applications.items.reduce<Record<string, number>>((acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1;
      return acc;
    }, {});

    return {
      profileCompleteness: computeProfileCompleteness(profile),
      resumeCount: resumes.length,
      savedInternshipCount: profile.savedInternshipIds.length,
      totalApplications: applications.items.length,
      applicationsByStatus: statusCounts,
      subscriptionTier: profile.subscriptionTier,
    };
  },

  async getAnalytics(userId: string) {
    const applications = await applicationService.getHistoryForStudent(userId, undefined, 200);

    const shortlisted = applications.items.filter((a) => a.status === "shortlisted" || a.status === "interview" || a.status === "hired").length;
    const total = applications.items.length;

    return {
      totalApplications: total,
      shortlistRate: total > 0 ? Number((shortlisted / total).toFixed(2)) : 0,
      hiredCount: applications.items.filter((a) => a.status === "hired").length,
    };
  },
};

function computeProfileCompleteness(profile: {
  fullName?: string;
  headline?: string | null;
  skills: string[];
  education: unknown[];
  experience: unknown[];
  resumeIds: unknown[];
}): number {
  const checks = [
    Boolean(profile.fullName),
    Boolean(profile.headline),
    profile.skills.length > 0,
    profile.education.length > 0,
    profile.experience.length > 0,
    profile.resumeIds.length > 0,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export type StudentService = typeof studentService;
