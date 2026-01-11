import { User } from "../models/user.model.js";
import type { UserDocument } from "../models/user.model.js";
import type { CreateUserInput } from "../validation/user.validation.js";

export const createUser = async (
  userData: CreateUserInput
): Promise<UserDocument> => {
  const user = await User.create(userData);
  return user;
};

export const findUserByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  const user = await User.findOne({ email });
  return user;
};

export const findUserById = async (
  id: string
): Promise<UserDocument | null> => {
  const user = await User.findById(id);
  return user;
};
