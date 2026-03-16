import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export default ReferralSubmission;
