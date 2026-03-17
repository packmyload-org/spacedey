import { handleLandlordInquiryWebhook } from '@/lib/services/landlordInquiryChat';

export async function POST(request: Request) {
  return handleLandlordInquiryWebhook(request);
}
