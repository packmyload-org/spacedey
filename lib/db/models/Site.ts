import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISite extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  image?: string;
  address: string;
  contact: {
    phone: string;
    email: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  unitTypes: Types.ObjectId[];
  measuringUnit: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSchema = new Schema<ISite>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a site name'],
    },
    code: {
      type: String,
      required: [true, 'Please provide a site code'],
      unique: true,
    },
    image: String,
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    unitTypes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UnitType',
      },
    ],
    measuringUnit: {
      type: String,
      default: 'ft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Site ||
  mongoose.model<ISite>('Site', SiteSchema);
