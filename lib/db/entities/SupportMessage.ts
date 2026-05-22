import type { SupportConversation } from './SupportConversation';
import type { ConversationMessageRole } from '@/lib/conversations/messages';

export class SupportMessage {
  id!: string;
  conversationId!: string;
  conversation?: SupportConversation;
  role!: ConversationMessageRole;
  content!: string;
  createdAt!: Date;
}

export default SupportMessage;
