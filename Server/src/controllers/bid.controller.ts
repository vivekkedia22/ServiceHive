import type { Request, Response } from "express";
import { createBidOps, findBidByGigIdAndFreelancerId, findBidsByGigId } from "../services/bid.service";
import { ApiError } from "../utils/apierror";
import { ApiResponse } from "../utils/apiresponse";
import { GIG_STATUS } from "../constants/gigStatus";
import { findGigById } from "../services/gig.service";

export const createBid = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const { gigId, message } = req.body;
    const freelancerId = req.user._id;
    const bid = await findBidByGigIdAndFreelancerId(gigId, freelancerId);
    if (bid) {
      throw new ApiError(400, "Bid already exists");
    }
    const gig = await findGigById(gigId);
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }
    if (gig.status !== GIG_STATUS.open) {
      throw new ApiError(400, "Gig is not open");
    }
    const newBid = await createBidOps({
      gigId,
      freelancerId,
      message,
    });
    return res.status(201).json(new ApiResponse(201, newBid, "Bid created"));
  } catch (error: any) {
    throw new ApiError(500, error?.message);
  }
};

export const getBidsByGigId = async (req: Request, res: Response) => {
  try {
    const { gigId } = req.params;
    const gig = await findGigById(gigId as string);
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }
    if (gig.ownerId.toHexString() !== req.user._id) {
      throw new ApiError(401, "Not authorized to view bids of other user gigs");
    }
    const bids = await findBidsByGigId(gigId as string);
    return res.status(200).json(new ApiResponse(200, bids, "Bids retrieved"));
  } catch (error: any) {
    throw new ApiError(error.statusCode ? error.statusCode : 500, error.message);
  }
};

