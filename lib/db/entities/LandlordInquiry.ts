import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { LandlordMessage } from '@/lib/db/entities/LandlordMessage';
import * as LandlordMessageEntity from '@/lib/db/entities/LandlordMessage';

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

  @OneToMany(() => LandlordMessageEntity.LandlordMessage, (message: LandlordMessage) => message.inquiry)
  messages!: Relation<LandlordMessage[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default LandlordInquiry;
