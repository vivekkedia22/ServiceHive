import { BID_STATUS } from '../constants/bidStatus';
import { GIG_STATUS } from '../constants/gigStatus';
import { Bid } from '../models/bid.model';
import { Gig } from '../models/gig.model';

export const hireBidOps = async (bidId: string, gigId: string, status: BID_STATUS): Promise<boolean> => {
    try {
        const gig = await Gig.findByIdAndUpdate(gigId, { $set: { status: GIG_STATUS.assigned } });
        if (!gig) {
            return false;
        }
        const bid = await Bid.findByIdAndUpdate(bidId, { $set: { status } }, { new: true });
        if (!bid) {
            return false;
        }
        await Bid.updateMany({ gigId: bid.gigId, _id: { $ne: bid._id } }, { $set: { status: BID_STATUS.rejected } });
        return true;
    } catch (error) {
        console.log("Failed to hire bid", error);
        return false;
    }
};
