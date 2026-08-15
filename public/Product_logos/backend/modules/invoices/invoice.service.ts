import { invoiceRepository } from "@/modules/invoices/invoice.repository";
import { planRepository } from "@/modules/plans/plan.repository";
import { authService } from "@/modules/auth/auth.service";
import { generateInvoiceNumber, renderReceiptText } from "@/payments/invoice.service";
import { NotFoundError, ForbiddenError } from "@/shared/errors";
import { buildPaginatedResult } from "@/shared/response/pagination";
import { createModuleLogger } from "@/config/logger.config";
import type { IPayment } from "@/database/models/payment.model";

const logger = createModuleLogger("invoice.service");

export const invoiceService = {
  async generateForPayment(payment: IPayment & { _id: unknown }) {
    const existing = await invoiceRepository.findByPaymentId(String(payment._id));
    if (existing) {
      return existing;
    }

    const [user, plan] = await Promise.all([
      authService.getUserById(String(payment.userId)),
      payment.planId ? planRepository.findById(String(payment.planId)) : Promise.resolve(null),
    ]);

    const invoice = await invoiceRepository.create({
      invoiceNumber: generateInvoiceNumber(),
      userId: String(payment.userId),
      paymentId: String(payment._id),
      subscriptionId: payment.subscriptionId ? String(payment.subscriptionId) : null,
      amountInPaise: payment.amountInPaise,
      currency: payment.currency,
      billingEmail: user.email,
      billingName: null,
      lineItems: [
        {
          description: plan ? `${plan.name} subscription` : "Subscription payment",
          amountInPaise: payment.amountInPaise,
        },
      ],
    });

    logger.info({ invoiceNumber: invoice.invoiceNumber, userId: String(payment.userId) }, "Invoice generated");
    return invoice;
  },

  async getHistory(userId: string, cursor: string | undefined, limit: number) {
    const results = await invoiceRepository.findByUser(userId, cursor, limit);
    return buildPaginatedResult(results, limit);
  },

  async getById(userId: string, invoiceId: string) {
    const invoice = await invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }
    if (String(invoice.userId) !== userId) {
      throw new ForbiddenError("You do not have access to this invoice");
    }
    return invoice;
  },

  async renderReceipt(userId: string, invoiceId: string): Promise<string> {
    const invoice = await this.getById(userId, invoiceId);
    return renderReceiptText({
      invoiceNumber: invoice.invoiceNumber,
      issuedAt: invoice.issuedAt,
      billingName: invoice.billingName,
      billingEmail: invoice.billingEmail,
      lineItems: invoice.lineItems,
      amountInPaise: invoice.amountInPaise,
      currency: invoice.currency,
    });
  },
};

export type InvoiceService = typeof invoiceService;
