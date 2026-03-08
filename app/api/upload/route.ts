import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { uploadFile } from '@/lib/services/gcp-storage';

export async function POST(request: NextRequest) {
    const adminCheck = await requireAdmin(request);

    if (!adminCheck.authorized) {
        return NextResponse.json(
            { ok: false, error: adminCheck.error },
            { status: adminCheck.status }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'sites';

        if (!file) {
            return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const publicUrl = await uploadFile(buffer, file.name, folder);

        return NextResponse.json({
            ok: true,
            url: publicUrl,
            fileName: file.name
        });
    } catch (error) {
        console.error('File upload error:', error);
        const message = error instanceof Error ? error.message : 'Upload failed';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
