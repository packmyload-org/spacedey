import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ConversationMessage } from '@/lib/conversations/messages';

@Entity({ name: 'landlord_inquiries' })
export class LandlordInquiry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  firstName!: string;

  @Column({ type: 'varchar' })
  lastName!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar' })
  streetAddress!: string;

  @Column({ type: 'varchar', nullable: true })
  region!: string | null;

  @Column({ type: 'varchar', nullable: true })
  squareFootage!: string | null;

  @Column({ type: 'text', nullable: true })
  details!: string | null;

  @Column({ type: 'varchar', default: 'new' })
  status!: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  chatThreadId!: string | null;

  @Column({ type: 'integer', default: 0 })
  botReplyCount!: number;

  @Column({ type: 'text', nullable: true })
  lastInboundMessage!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastInboundAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastOutboundAt!: Date | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  conversationMessages!: ConversationMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default LandlordInquiry;
