import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { invoiceService } from "@/modules/invoices/invoice.service";
import { invoiceHistoryQuerySchema } from "@/modules/invoices/invoice.validators";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import type { AuthContext } from "@/middlewares/auth.middleware";

export const invoiceController = {
  async history(request: NextRequest, context: AuthContext) {
    const parsed = invoiceHistoryQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    if (!parsed.success) {
      throw new ValidationError("Invalid query parameters", parsed.error.flatten());
    }

    const result = await invoiceService.getHistory(context.user.id, parsed.data.cursor, parsed.data.limit);
    return ApiResponse.success(result, "Invoice history retrieved");
  },

  async getById(request: NextRequest, context: AuthContext) {
    const invoiceId = context.params?.id;
    if (!invoiceId) throw new ValidationError("Invoice id is required");

    const invoice = await invoiceService.getById(context.user.id, invoiceId);
    return ApiResponse.success(invoice, "Invoice retrieved");
  },

  async download(request: NextRequest, context: AuthContext) {
    const invoiceId = context.params?.id;
    if (!invoiceId) throw new ValidationError("Invoice id is required");

    const receiptText = await invoiceService.renderReceipt(context.user.id, invoiceId);
    return new NextResponse(receiptText, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="invoice-${invoiceId}.txt"`,
      },
    });
  },
};
