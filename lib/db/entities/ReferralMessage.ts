import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { ReferralSubmission } from '@/lib/db/entities/ReferralSubmission';
import type { ConversationMessageRole } from '@/lib/conversations/messages';
import * as ReferralSubmissionEntity from '@/lib/db/entities/ReferralSubmission';

@Entity({ name: 'referral_messages' })
export class ReferralMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  submissionId!: string;

  @ManyToOne(() => ReferralSubmissionEntity.ReferralSubmission, (submission: ReferralSubmission) => submission.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'submissionId' })
  submission!: Relation<ReferralSubmission>;

  @Column({ type: 'varchar' })
  role!: ConversationMessageRole;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

export default ReferralMessage;
