import { handleSupportEmailWebhook } from '@/lib/services/supportEmailChat';

export async function POST(request: Request) {
  return handleSupportEmailWebhook(request);
}
