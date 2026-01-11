import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { findUserById } from "./services/user.service";
import type { JWTPayload } from "./types";
import { eventListener } from "./eventListener";
import type { GigDocument } from "./models/gig.model";
import cookie from "cookie"

/**
 * Connects the socket.io to the server
 * @param server
 * @returns {Server}
 */
export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://servicehive-0ffg.onrender.com"],
      credentials: true,

    },
  });

  // Move the hire event listener outside of connection handler
  eventListener.on("hire", (data: { gig: GigDocument, freelancerId: string }) => {
    console.log("Emitting hire event to freelancer:", data.freelancerId);
    io.to(data.freelancerId).emit("hire", data);
  });

  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      socket.disconnect();
      return;
    }

    const { authToken } = cookie.parse(cookies);

    try {
      const payload = jwt.verify(authToken, process.env.JWT_SECRET as string) as JWTPayload;
      const user = await findUserById(payload._id);
      if (!user) {
        socket.disconnect();
        return;
      }
      socket.join(user._id.toHexString());
    } catch (error) {
      console.log('Invalid token in socket connection');
      socket.disconnect();
      return;
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  return io;
};
