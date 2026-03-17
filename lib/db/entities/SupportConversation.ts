import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { ConversationMessage } from '@/lib/conversations/messages';

@Entity({ name: 'support_conversations' })
export class SupportConversation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  threadId!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  fullName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', nullable: true })
  topic!: string | null;

  @Column({ type: 'varchar', default: 'new' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  firstMessage!: string | null;

  @Column({ type: 'text', nullable: true })
  lastInboundMessage!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastInboundAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastOutboundAt!: Date | null;

  @Column({ type: 'integer', default: 0 })
  botReplyCount!: number;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  messages!: ConversationMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default SupportConversation;
