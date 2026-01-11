import express from "express";
import cors from "cors";
import { logger } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import bidRoutes from "./routes/bid.routes";
import gigRoutes from "./routes/gig.routes";
import hiringRoutes from "./routes/hiring.routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();

dotenv.config({ path: ".env.server" });
console.log(process.env.JWT_SECRET);
console.log(process.env.MONGO_URI);

if (
  !process.env.JWT_SECRET ||
  !process.env.MONGO_URI ||
  !process.env.JWT_EXPIRES_IN
) {
  throw new Error("Missing environment variables");
}
app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(logger);

app.use("/api", userRoutes);
app.use("/api", gigRoutes);
app.use("/api", bidRoutes);
app.use("/api", hiringRoutes);
app.use(errorHandler);

export default app;
