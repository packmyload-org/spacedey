import type { ReferralSubmission } from './ReferralSubmission';
import type { ConversationMessageRole } from '@/lib/conversations/messages';

export class ReferralMessage {
  id!: string;
  submissionId!: string;
  submission?: ReferralSubmission;
  role!: ConversationMessageRole;
  content!: string;
  createdAt!: Date;
}

export default ReferralMessage;
