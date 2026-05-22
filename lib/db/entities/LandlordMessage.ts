import type { LandlordInquiry } from './LandlordInquiry';
import type { ConversationMessageRole } from '@/lib/conversations/messages';

export class LandlordMessage {
  id!: string;
  inquiryId!: string;
  inquiry?: LandlordInquiry;
  role!: ConversationMessageRole;
  content!: string;
  createdAt!: Date;
}

export default LandlordMessage;
