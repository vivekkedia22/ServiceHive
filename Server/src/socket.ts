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
  console.log("Trying to create a Socket connection");
  let io: Server;
  try {
    io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
      },
      cookie: {
        name: "authToken",
        httpOnly: true,
        sameSite: "none",
        secure: true
      },
      transports: ["websocket"],
    })
  } catch (error) {
    console.log("Error:Failed to create a Socket connection", error);
    throw new Error("Failed to create a Socket connection");
  }

  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      socket.emit("unauthorized", { cookie });
      return socket.disconnect();
    }

    const { authToken } = cookie.parse(cookies);
    if (!authToken) {
      socket.emit("unauthorized", { cookie });
      return socket.disconnect();

    }
    console.log("authToken::", authToken);
    try {
      const payload = jwt.verify(authToken!, process.env.JWT_SECRET as string) as unknown as JWTPayload;
      const user = await findUserById(payload._id);
      if (!user) {
        socket.emit("unauthorized", { cookie });
        return socket.disconnect();
      }
      socket.join(user._id.toHexString());
    } catch (error) {
      socket.emit("unauthorized", { cookie });
      return socket.disconnect();


    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  eventListener.on("hire", (data: { gig: GigDocument, freelancerId: string }) => {
    console.log("Emitting hire event to freelancer:", data.freelancerId);
    io.to(data.freelancerId).emit("hire", data);
  });

  return io;
};
