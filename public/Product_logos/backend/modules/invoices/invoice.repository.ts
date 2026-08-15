import { InvoiceModel } from "@/database/models/invoice.model";

export interface CreateInvoiceData {
  invoiceNumber: string;
  userId: string;
  paymentId: string;
  subscriptionId: string | null;
  amountInPaise: number;
  currency: string;
  billingEmail: string;
  billingName: string | null;
  lineItems: { description: string; amountInPaise: number }[];
}

export const invoiceRepository = {
  async create(data: CreateInvoiceData) {
    const invoice = await InvoiceModel.create({ ...data, status: "issued", issuedAt: new Date() });
    return invoice.toObject();
  },

  async findByPaymentId(paymentId: string) {
    return InvoiceModel.findOne({ paymentId }).lean().exec();
  },

  async findById(id: string) {
    return InvoiceModel.findById(id).lean().exec();
  },

  async findByUser(userId: string, cursor: string | undefined, limit: number) {
    const query: Record<string, unknown> = { userId };
    if (cursor) query._id = { $lt: cursor };

    return InvoiceModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean()
      .exec();
  },
};

export type InvoiceRepository = typeof invoiceRepository;
