import { Storage } from '@google-cloud/storage';
import path from 'path';

// Load the service account key from environment variable
// In development, this could be a path to a JSON file
// In production (Cloud Run), it will use default credentials
const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: process.env.GCP_SERVICE_ACCOUNT_KEY
        ? JSON.parse(Buffer.from(process.env.GCP_SERVICE_ACCOUNT_KEY, 'base64').toString())
        : undefined
});

const bucketName = process.env.GCP_STORAGE_BUCKET || 'spacedey-uploads';
const bucket = storage.bucket(bucketName);

export async function uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    folder: string = 'sites'
): Promise<string> {
    const uniqueName = `${folder}/${Date.now()}-${path.basename(fileName)}`;
    const file = bucket.file(uniqueName);

    await file.save(fileBuffer, {
        metadata: {
            contentType: getContentType(fileName),
        },
        resumable: false,
    });

    // Make the file publicly accessible
    // Note: For production, you might want to keep it private and use signed URLs
    // but for site images, public is usually fine.
    await file.makePublic();

    return `https://storage.googleapis.com/${bucketName}/${uniqueName}`;
}

function getContentType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.webp':
            return 'image/webp';
        case '.pdf':
            return 'application/pdf';
        default:
            return 'application/octet-stream';
    }
}
