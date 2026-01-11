import mongoose from "mongoose";
export const connectDB = async () => {
  console.log("Connecting to the database...");
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (error) {
    throw new Error("Database connection failed");
  }
};

export const disconnectDB = async () => {
  console.log("Database disconnected");
};
