import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { LandlordInquiry } from '@/lib/db/entities/LandlordInquiry';
import type { ConversationMessageRole } from '@/lib/conversations/messages';
import * as LandlordInquiryEntity from '@/lib/db/entities/LandlordInquiry';

@Entity({ name: 'landlord_messages' })
export class LandlordMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  inquiryId!: string;

  @ManyToOne(() => LandlordInquiryEntity.LandlordInquiry, (inquiry: LandlordInquiry) => inquiry.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inquiryId' })
  inquiry!: Relation<LandlordInquiry>;

  @Column({ type: 'varchar' })
  role!: ConversationMessageRole;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

export default LandlordMessage;
