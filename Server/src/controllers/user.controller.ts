import type { Request, Response } from "express";
import { findUserByEmail, findUserById } from "../services/user.service";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";

/**
 *
 * @param req
 * @param res
 * the api handler for user registration
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const foundUser = await findUserByEmail(email);
    if (foundUser) {
      throw new ApiError(400, "User already exists");
    }
    const user = await User.create({ name, email, password });
    if (!user) {
      throw new ApiError(500, "User registration failed");
    }
    const token = user.generateToken();
    res.cookie("authToken", token, { httpOnly: true });
    return res
      .status(201)
      .json(new ApiResponse(201, user, "Registration successful"));
  } catch (error: any) {
    throw new ApiError(500, error?.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const foundUser = await findUserByEmail(email);
    if (!foundUser) {
      throw new ApiError(400, "User not found");
    }
    const isPasswordValid = await foundUser.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid password");
    }
    const token = foundUser.generateToken();
    res.cookie("authToken", token, { httpOnly: true });
    return res
      .status(200)
      .json(new ApiResponse(200, foundUser, "Login successful"));
  } catch (error: any) {
    throw new ApiError(500, error?.message);
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    const user = await findUserById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User retrieved successfully"));
  } catch (error: any) {
    throw new ApiError(500, error?.message);
  }
};
