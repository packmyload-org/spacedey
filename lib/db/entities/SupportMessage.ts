import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { SupportConversation } from '@/lib/db/entities/SupportConversation';
import type { ConversationMessageRole } from '@/lib/conversations/messages';
import * as SupportConversationEntity from '@/lib/db/entities/SupportConversation';

@Entity({ name: 'support_messages' })
export class SupportMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  conversationId!: string;

  @ManyToOne(() => SupportConversationEntity.SupportConversation, (conversation: SupportConversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation!: Relation<SupportConversation>;

  @Column({ type: 'varchar' })
  role!: ConversationMessageRole;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

export default SupportMessage;
