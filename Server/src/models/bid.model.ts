import mongoose, { Model, Schema, Document } from "mongoose";
import { BID_STATUS } from "../constants/bidStatus";

interface Bid {
  gigId: string;
  freelancerId: string;
  message: string;
  status: BID_STATUS;
}

export interface BidDocument extends Document {
  _id: mongoose.Types.ObjectId;
  gigId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;
  message: string;
  status: BID_STATUS;
  createdAt: Date;
  updatedAt: Date;
}

interface BidModel extends Model<BidDocument> {}

const bidSchema = new Schema(
  {
    gigId: { type: Schema.Types.ObjectId, ref: "Gig", required: true },
    freelancerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: BID_STATUS, default: BID_STATUS.pending },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
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

const Bid = mongoose.model<BidDocument, BidModel>("Bid", bidSchema);
export { Bid };
