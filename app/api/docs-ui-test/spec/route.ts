import { getOpenApiSpec } from '@/lib/openapi';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(getOpenApiSpec());
}

