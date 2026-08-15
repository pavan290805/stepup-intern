import { NextResponse } from "next/server";
import { openApiSpec } from "@/config/swagger.config";

export async function GET() {
  return NextResponse.json(openApiSpec);
}

/**
 * @openapi
 * /docs:
 *   get:
 *     operationId: openApiSpec
 *     summary: OpenAPI 3.0 specification (JSON)
 *     description: |
 *       Returns the complete OpenAPI 3.0 specification for this API as JSON.
 *       This endpoint powers the interactive Swagger UI documentation.
 *     tags:
 *       - Documentation
 *     responses:
 *       '200':
 *         description: OpenAPI specification JSON document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: OpenAPI 3.0 specification object
 *       '500':
 *         $ref: '#/components/responses/InternalError'
 */
