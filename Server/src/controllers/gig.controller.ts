import type { Request, Response } from "express";
import { createGigOps, findAllGigs, findGigById } from "../services/gig.service";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/apierror.js";



export const createGig = async (req: Request, res: Response) => {
  try {
    const { title, description, budget } = req.body;
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const gig = await createGigOps({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });
    if (!gig) {
      throw new ApiError(500, "Failed to create gig");
    }
    return res.status(201).json(new ApiResponse(201, gig, "Gig created"));
  } catch (error) {
    throw new ApiError(500, "Failed to create gig");
  }
};

export const getGigs = async (req: Request, res: Response) => {
  try {

    const { title } = req.query;
    const titleString = title !== undefined ? (title.toString()) : "";
    const gigs = await findAllGigs(titleString);
    return res.status(200).json(new ApiResponse(200, gigs, "Gigs retrieved"));
  } catch (error) {
    console.log("Failed to retrieve gigs", error);
    throw new ApiError(500, "Failed to retrieve gigs");
  }
};


export const getGigById = async (req: Request, res: Response) => {
  try {
    const { gigId } = req.params;
    const gig = await findGigById(gigId as string);
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }
    return res.status(200).json(new ApiResponse(200, gig, "Gig retrieved"));
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve gig");
  }
};