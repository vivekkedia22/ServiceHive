import { BID_STATUS } from '../constants/bidStatus';
import { Bid } from '../models/bid.model';
import type { BidDocument } from '../models/bid.model';
import type { CreateBidInput } from '../validation/bid.validation';

export const createBidOps = async (bidData: CreateBidInput): Promise<BidDocument> => {
  const bid = await Bid.create({ ...bidData, status: BID_STATUS.pending });
  return bid;
};
export const findBidById = async (bidId: string): Promise<BidDocument | null> => {
  const bid = await Bid.findById(bidId);
  return bid;
};

export const findBidsByGigId = async (gigId: string): Promise<BidDocument[]> => {
  const bids = await Bid.find({
    gigId,
  });
  return bids;
};
export const findBidByGigIdAndFreelancerId = async (gigId: string, freelancerId: string): Promise<BidDocument | null> => {
  const bid = await Bid.findOne({
    gigId,
    freelancerId,
  });
  return bid;
}