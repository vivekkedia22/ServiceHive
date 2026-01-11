import mongoose, { Model, Schema, Document } from "mongoose";
import { GIG_STATUS } from "../constants/gigStatus.js";

interface Gig {
  title: string;
  description: string;
  budget: number;
  ownerId: string;
  status: GIG_STATUS;
}

export interface GigDocument extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  ownerId: mongoose.Types.ObjectId;
  status: GIG_STATUS;
  createdAt: Date;
  updatedAt: Date;
}

interface GigModel extends Model<GigDocument> {}

const gigSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: GIG_STATUS, default: GIG_STATUS.open },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret: any) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

const Gig = mongoose.model<GigDocument, GigModel>("Gig", gigSchema);
export { Gig };
