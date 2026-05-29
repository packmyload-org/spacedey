import { UserRole } from '@/lib/types/roles';
import { comparePassword, hashPassword } from '@/lib/auth/password';

export class User {
  id!: string;
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  role!: UserRole;
  emailVerifiedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  async hashPassword() {
    this.password = await hashPassword(this.password);
  }

  async comparePassword(candidate: string): Promise<boolean> {
    return comparePassword(candidate, this.password);
  }
}

export default User;
