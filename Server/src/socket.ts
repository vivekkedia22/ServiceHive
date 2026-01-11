import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { findUserById } from "./services/user.service";
import type { JWTPayload } from "./types";
import { eventListener } from "./eventListener";
import type { GigDocument } from "./models/gig.model";
import { Bid, Bid, type BidDocument } from "./models/bid.model";
/**
 * Connects the socket.io to the server
 * @param server
 * @returns {Server}
 */
export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
  });
  
  // Move the hire event listener outside of connection handler
  eventListener.on("hire", (data: { gig: GigDocument, freelancerId: string }) => {
    console.log("Emitting hire event to freelancer:", data.freelancerId);
    io.to(data.freelancerId).emit("hire", data);
  });
  
  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    let token = socket.handshake.auth.token;
    console.log("token,token");
    if (!token) {
      const cookies = socket.handshake.headers.cookie;
      console.log("coookies", cookies)
      if (cookies) {
        const authCookie = cookies.split('; ').find(row => row.startsWith('authToken='));
        token = authCookie?.split('=')[1];
      }
    }

    if (!token) {
      console.log('No token found in socket connection');
      socket.disconnect();
      return;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
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
