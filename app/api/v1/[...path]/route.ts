// app/api/v1/[...path]/route.ts
// Catch-all proxy route for Storeganise API endpoints not handled by specific routes

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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullEndpoint = queryString ? `${path}?${queryString}` : path;

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

    const body = await request.json().catch(() => null);

    return proxyToStoreganise(path, {
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

    const body = await request.json().catch(() => null);

    return proxyToStoreganise(path, {
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

    const body = await request.json().catch(() => null);

    return proxyToStoreganise(path, {
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

    return proxyToStoreganise(path, {
        method: 'DELETE',
        token: token || undefined,
    });
}
