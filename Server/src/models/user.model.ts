import mongoose, { Model, mongo, Schema } from "mongoose";
import { Document } from "mongoose";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import type { JWTPayload } from "../types";

interface User {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateToken(): string;
}

interface UserModel extends Model<UserDocument> { }

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret: any) {
        delete ret.password;
        delete ret._v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await argon2.hash(this.password);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  return await argon2.verify(this.password, password);
};

userSchema.methods.generateToken = function (): string {
  const user = this;
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  const payload: JWTPayload = {
    _id: user._id.toString(),
    email: user.email
  }
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn as any,
  });
  return token;
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
