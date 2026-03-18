import { handleReferralFollowUpWebhook } from '@/lib/services/referralFollowUpChat';

export async function POST(request: Request) {
  return handleReferralFollowUpWebhook(request);
}
