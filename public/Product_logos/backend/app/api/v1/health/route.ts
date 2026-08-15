import { connectToDatabase, getConnectionState } from "@/config/db.config";
import { ApiResponse } from "@/shared/response/api-response";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";

async function handler() {
  await connectToDatabase();

  return ApiResponse.success({
    status: "ok",
    database: getConnectionState(),
    timestamp: new Date().toISOString(),
  });
}

export const GET = withErrorHandler(handler);

/**
 * @openapi
 * /health:
 *   get:
 *     operationId: healthCheck
 *     summary: Service health check
 *     description: |
 *       Returns the current operational status of the API server and its
 *       database connection. Suitable for use by load balancers and
 *       monitoring systems. No authentication required.
 *     tags:
 *       - Health
 *     responses:
 *       '200':
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               data:
 *                 status: ok
 *                 database: connected
 *                 timestamp: '2026-01-01T00:00:00.000Z'
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */
