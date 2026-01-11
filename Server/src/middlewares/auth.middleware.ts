import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/user.service";
import { ApiError } from "../utils/apierror";
import type { JWTPayload } from "../types";


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      throw new ApiError(401, "Unauthorized")
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const userId = payload._id;
    const foundUser = await findUserById(userId);
    if (!foundUser || foundUser.email !== payload.email) {
      throw new ApiError(401, "Unauthorized")
    }
    req.user = { _id: foundUser._id.toHexString() }
    next()
  } catch (error) {
    next(error);
  }
};
