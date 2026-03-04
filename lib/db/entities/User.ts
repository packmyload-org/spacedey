import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/lib/types/roles';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  // Deprecated - kept for compatibility
  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    // If password already hashed (starts with $2a$), skip
    if (this.password.startsWith('$2')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(candidate: string): Promise<boolean> {
    return await bcrypt.compare(candidate, this.password);
  }
}

export default User;
