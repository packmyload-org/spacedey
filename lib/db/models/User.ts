import mongoose, { Schema, Document, type HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/lib/types/roles';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isAdmin: boolean; // Deprecated - use role instead
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
    },
    phone: String,
    role: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.USER],
      default: UserRole.USER,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      get: function (this: HydratedDocument<IUser>) {
        return this.role === UserRole.ADMIN;
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  const doc = this as HydratedDocument<IUser>;
  
  if (!doc.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    doc.password = await bcrypt.hash(doc.password, salt);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
