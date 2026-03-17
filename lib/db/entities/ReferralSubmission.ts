import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { ConversationMessage } from '@/lib/conversations/messages';

@Entity({ name: 'referral_submissions' })
export class ReferralSubmission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  referrerUserId!: string | null;

  @Column({ type: 'varchar' })
  firstName!: string;

  @Column({ type: 'varchar' })
  lastName!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  refereeFirstName!: string;

  @Column({ type: 'varchar', nullable: true })
  refereeLastName!: string | null;

  @Column({ type: 'varchar' })
  refereeEmail!: string;

  @Column({ type: 'varchar', nullable: true })
  refereePhone!: string | null;

  @Column({ type: 'varchar' })
  refereeLocation!: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  chatThreadId!: string | null;

  @Column({ type: 'varchar', default: 'new' })
  followUpStatus!: string;

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

export default ReferralSubmission;
