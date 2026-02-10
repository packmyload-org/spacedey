// app/api/v1/users/[...path]/route.ts
// Proxy route for Storeganise API v1/users endpoints

import { NextRequest } from 'next/server';
import { proxyToStoreganise, getAuthToken } from '@/lib/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = getAuthToken(request);
  const resolvedParams = await params;
  const path = resolvedParams.path && resolvedParams.path.length > 0 
    ? `/${resolvedParams.path.join('/')}` 
    : '';
  const endpoint = `/v1/users${path}`;
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

  return proxyToStoreganise(fullEndpoint, {
    method: 'GET',
    token: token || undefined,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = getAuthToken(request);
  const resolvedParams = await params;
  const path = resolvedParams.path && resolvedParams.path.length > 0 
    ? `/${resolvedParams.path.join('/')}` 
    : '';
  const endpoint = `/v1/users${path}`;
  
  const body = await request.json().catch(() => null);

  return proxyToStoreganise(endpoint, {
    method: 'POST',
    body,
    token: token || undefined,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = getAuthToken(request);
  const resolvedParams = await params;
  const path = resolvedParams.path && resolvedParams.path.length > 0 
    ? `/${resolvedParams.path.join('/')}` 
    : '';
  const endpoint = `/v1/users${path}`;
  
  const body = await request.json().catch(() => null);

  return proxyToStoreganise(endpoint, {
    method: 'PUT',
    body,
    token: token || undefined,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = getAuthToken(request);
  const resolvedParams = await params;
  const path = resolvedParams.path && resolvedParams.path.length > 0 
    ? `/${resolvedParams.path.join('/')}` 
    : '';
  const endpoint = `/v1/users${path}`;
  
  const body = await request.json().catch(() => null);

  return proxyToStoreganise(endpoint, {
    method: 'PATCH',
    body,
    token: token || undefined,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = getAuthToken(request);
  const resolvedParams = await params;
  const path = resolvedParams.path && resolvedParams.path.length > 0 
    ? `/${resolvedParams.path.join('/')}` 
    : '';
  const endpoint = `/v1/users${path}`;

  return proxyToStoreganise(endpoint, {
    method: 'DELETE',
    token: token || undefined,
  });
}

