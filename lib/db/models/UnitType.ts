import mongoose, { Schema, Document } from 'mongoose';

export interface IUnitType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  dimensions: {
    width: number;
    depth: number;
    unit: string;
  };
  price: {
    amount: number;
    currency: string;
    originalAmount?: number;
  };
  description?: string;
  availableCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UnitTypeSchema = new Schema<IUnitType>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a unit type name'],
    },
    dimensions: {
      width: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        default: 'ft',
      },
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'NGN',
      },
      originalAmount: Number,
    },
    description: String,
    availableCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UnitType ||
  mongoose.model<IUnitType>('UnitType', UnitTypeSchema);
