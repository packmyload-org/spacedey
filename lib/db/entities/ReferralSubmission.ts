import type { ReferralMessage } from './ReferralMessage';

export class ReferralSubmission {
  id!: string;
  referrerUserId!: string | null;
  firstName!: string;
  lastName!: string;
  email!: string;
  refereeFirstName!: string;
  refereeLastName!: string | null;
  refereeEmail!: string;
  refereePhone!: string | null;
  refereeLocation!: string;
  chatThreadId!: string | null;
  followUpStatus!: string;
  botReplyCount!: number;
  lastInboundMessage!: string | null;
  lastInboundAt!: Date | null;
  lastOutboundAt!: Date | null;
  messages?: ReferralMessage[];
  createdAt!: Date;
  updatedAt!: Date;
}

export default ReferralSubmission;
