// app/api/v1/admin/route.ts
// Root admin endpoint

import { NextRequest } from 'next/server';
import { proxyToStoreganise, getAuthToken } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/v1/admin?${queryString}` : '/v1/admin';

  return proxyToStoreganise(endpoint, {
    method: 'GET',
    token: token || undefined,
  });
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  const body = await request.json().catch(() => null);

  return proxyToStoreganise('/v1/admin', {
    method: 'POST',
    body,
    token: token || undefined,
  });
}

