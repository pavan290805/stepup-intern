import { Schema, model, models, type Model } from "mongoose";

export const INVOICE_STATUSES = ["issued", "paid", "void"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export interface IInvoice {
  invoiceNumber: string;
  userId: Schema.Types.ObjectId;
  paymentId: Schema.Types.ObjectId;
  subscriptionId: Schema.Types.ObjectId | null;
  amountInPaise: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: Date;
  billingName: string | null;
  billingEmail: string;
  lineItems: { description: string; amountInPaise: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const lineItemSchema = new Schema(
  {
    description: { type: String, required: true },
    amountInPaise: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true, unique: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription", default: null },
    amountInPaise: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    status: { type: String, enum: INVOICE_STATUSES, default: "issued" },
    issuedAt: { type: Date, required: true, default: () => new Date() },
    billingName: { type: String, default: null },
    billingEmail: { type: String, required: true },
    lineItems: { type: [lineItemSchema], default: [] },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ paymentId: 1 }, { unique: true });
invoiceSchema.index({ userId: 1, createdAt: -1 });

export const InvoiceModel: Model<IInvoice> = models.Invoice ?? model<IInvoice>("Invoice", invoiceSchema);
