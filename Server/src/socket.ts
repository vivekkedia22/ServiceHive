import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { findUserById } from "./services/user.service";
import type { JWTPayload } from "./types";
import { eventListener } from "./eventListener";
import type { GigDocument } from "./models/gig.model";
/**
 * Connects the socket.io to the server
 * @param server
 * @returns {Server}
 */
export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);
    const token = socket.handshake.auth.token;
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const user = await findUserById(payload._id);
    if (!user) {
      socket.disconnect();
      return;
    }
    socket.join(user._id.toHexString())
    eventListener.on("hire", (data: { gig: GigDocument }) => {
      console.log("User Hired", user.name);
      socket.to(user._id.toHexString()).emit("hire", data);
    })
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });
  return io;
};
