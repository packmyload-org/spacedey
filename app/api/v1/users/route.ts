// app/api/v1/users/route.ts
// Root users endpoint

import { NextRequest } from 'next/server';
import { proxyToStoreganise, getAuthToken } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/v1/users?${queryString}` : '/v1/users';

  return proxyToStoreganise(endpoint, {
    method: 'GET',
    token: token || undefined,
  });
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  const body = await request.json().catch(() => null);

  return proxyToStoreganise('/v1/users', {
    method: 'POST',
    body,
    token: token || undefined,
  });
}

