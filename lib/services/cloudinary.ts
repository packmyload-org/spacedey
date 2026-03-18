import { env } from '@/config/env';

const CLOUDINARY_CLOUD_NAME = env.integrations.cloudinary.cloudName;
const CLOUDINARY_API_KEY = env.integrations.cloudinary.apiKey;
const CLOUDINARY_API_SECRET = env.integrations.cloudinary.apiSecret;
const CLOUDINARY_FOLDER_PREFIX = env.integrations.cloudinary.folderPrefix;

function getCloudinaryAuthHeader() {
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured.');
  }

  const credentials = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64');
  return `Basic ${credentials}`;
}

function getCloudinaryUploadUrl() {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Missing CLOUDINARY_CLOUD_NAME.');
  }

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
}

function buildFolderPath(folder: string) {
  const trimmedFolder = folder.replace(/^\/+|\/+$/g, '');
  return trimmedFolder ? `${CLOUDINARY_FOLDER_PREFIX}/${trimmedFolder}` : CLOUDINARY_FOLDER_PREFIX;
}

export function isCloudinaryConfigured() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

export async function uploadFileToCloudinary(args: {
  fileBuffer: Buffer;
  fileName: string;
  folder?: string;
  contentType?: string;
}) {
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(args.fileBuffer)], {
    type: args.contentType || 'application/octet-stream',
  });

  formData.append('file', blob, args.fileName);
  formData.append('folder', buildFolderPath(args.folder || 'sites'));
  formData.append('use_filename', 'true');
  formData.append('unique_filename', 'true');

  const response = await fetch(getCloudinaryUploadUrl(), {
    method: 'POST',
    headers: {
      Authorization: getCloudinaryAuthHeader(),
    },
    body: formData,
  });

  const payload = await response.json() as {
    secure_url?: string;
    original_filename?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message || 'Cloudinary upload failed.');
  }

  return {
    url: payload.secure_url,
    fileName: payload.original_filename || args.fileName,
  };
}
