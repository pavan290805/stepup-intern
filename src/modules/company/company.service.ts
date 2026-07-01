import { CompanyInput } from '@/lib/validations';
import Company, { ICompany } from '@/models/Company';
import { PaginationQuery } from '@/types';

export const companyService = {
  async createCompany(input: CompanyInput): Promise<ICompany> {
    const existingCompany = await Company.findOne({ name: input.name });
    if (existingCompany) {
      throw new Error('Company with this name already exists');
    }

    return Company.create(input);
  },

  async getCompanies(query: PaginationQuery & { verified?: boolean }): Promise<{
    companies: ICompany[];
    total: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query.verified) {
      filter.verificationStatus = 'verified';
    }

    if (query.search) {
      filter.$or = [{ name: { $regex: query.search, $options: 'i' } }];
    }

    const companies = await Company.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

    const total = await Company.countDocuments(filter);

    return { companies, total };
  },

  async getCompanyById(companyId: string): Promise<ICompany | null> {
    return Company.findById(companyId);
  },

  async updateCompany(companyId: string, input: Partial<CompanyInput>): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(companyId, input, { new: true });
  },

  async verifyCompany(companyId: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(companyId, { verificationStatus: 'verified' }, { new: true });
  },

  async rejectCompany(companyId: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(companyId, { verificationStatus: 'rejected' }, { new: true });
  },

  async deleteCompany(companyId: string): Promise<void> {
    await Company.findByIdAndDelete(companyId);
  },
};
