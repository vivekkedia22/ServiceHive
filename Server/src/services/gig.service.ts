import { GIG_STATUS } from "../constants/gigStatus";
import { Gig } from "../models/gig.model";
import type { GigDocument } from "../models/gig.model";
import type { CreateGigInput } from "../validation/gig.validation";

export const createGigOps = async (
  gigData: CreateGigInput
): Promise<GigDocument | null> => {
  const gig = await Gig.create(gigData);
  return gig;
};

export const findAllGigs = async (title: string): Promise<GigDocument[]> => {
  const gigs = title ? await Gig.find({ status: GIG_STATUS.open, title: { $regex: title, $options: "i" } }) : await Gig.find({
    status: GIG_STATUS.open,
  });
  return gigs;
};

export const findGigById = async (gigId: string): Promise<GigDocument | null> => {
  const gig = await Gig.findById(gigId);
  return gig;
};

export const updateGigStatus = async (
  gigId: string,
  status: GIG_STATUS
): Promise<GigDocument | null> => {
  const gig = await Gig.findByIdAndUpdate(
    gigId,
    { $set: { status } },
    { new: true }
  );
  return gig;
};
