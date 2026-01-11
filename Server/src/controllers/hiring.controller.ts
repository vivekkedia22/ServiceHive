import mongoose from "mongoose"
import { ApiError } from "../utils/apierror";
import type { Request, Response } from "express"
import { findBidById } from "../services/bid.service";
import { findGigById } from "../services/gig.service";
import { hireBidOps } from "../services/hiring.service";
import { GIG_STATUS } from "../constants/gigStatus";
import { BID_STATUS } from "../constants/bidStatus";
import { ApiResponse } from "../utils/apiresponse";
import { eventListener } from "../eventListener";
export const hireBid = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            throw new ApiError(401, "Unauthorized");
        }
        const { bidId } = req.params;
        const bid = await findBidById(bidId as string);
        if (!bid) {
            throw new ApiError(404, "Bid not found");
        }
        const gigId = bid.gigId.toHexString();
        const gig = await findGigById(gigId as string);
        if (!gig) {
            throw new ApiError(404, "Gig not found");
        }
        if (gig.status !== GIG_STATUS.open) {
            throw new ApiError(400, "Gig is not open");
        }
        if (gig.ownerId.toHexString() !== req.user._id) {
            throw new ApiError(401, "Unauthorized");
        }
        const hiredBid = await hireBidOps(bidId as string, gigId, BID_STATUS.hired);
        if (!hiredBid) {
            throw new ApiError(500, "Failed to hire bid");
        }
        console.log("emititng nothng here");
        eventListener.emit("hire", {
            gig,
            freelancerId: bid.freelancerId.toHexString()
        });
        return res.status(200).json(new ApiResponse(200, hiredBid, "Bid hired"));
    } catch (error: any) {

        throw new ApiError(500, error.message);
    }
}