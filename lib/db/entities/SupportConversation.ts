import type { SupportMessage } from './SupportMessage';

export class SupportConversation {
  id!: string;
  threadId!: string;
  email!: string;
  fullName!: string | null;
  topic!: string | null;
  status!: string;
  firstMessage!: string | null;
  lastInboundMessage!: string | null;
  lastInboundAt!: Date | null;
  lastOutboundAt!: Date | null;
  botReplyCount!: number;
  messages?: SupportMessage[];
  createdAt!: Date;
  updatedAt!: Date;
}

export default SupportConversation;
