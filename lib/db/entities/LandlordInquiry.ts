import type { LandlordMessage } from './LandlordMessage';

export class LandlordInquiry {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string | null;
  streetAddress!: string;
  region!: string | null;
  squareFootage!: string | null;
  details!: string | null;
  status!: string;
  chatThreadId!: string | null;
  botReplyCount!: number;
  lastInboundMessage!: string | null;
  lastInboundAt!: Date | null;
  lastOutboundAt!: Date | null;
  messages?: LandlordMessage[];
  createdAt!: Date;
  updatedAt!: Date;
}

export default LandlordInquiry;
