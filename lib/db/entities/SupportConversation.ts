import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { SupportMessage } from '@/lib/db/entities/SupportMessage';
import * as SupportMessageEntity from '@/lib/db/entities/SupportMessage';

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

  @OneToMany(() => SupportMessageEntity.SupportMessage, (message: SupportMessage) => message.conversation)
  messages!: Relation<SupportMessage[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default SupportConversation;
