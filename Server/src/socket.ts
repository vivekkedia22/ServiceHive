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
      origin: [process.env.CLIENT_URL!, "http://localhost:5173"],
      credentials: true,
    },
    path:"/socket.io",
    // transports: ["websocket"],
  });
  io.engine.on("connection", (engineSocket) => {
    console.log("ENGINE handshake headers:", {
      origin: engineSocket.request.headers.origin,
      cookie: engineSocket.request.headers.cookie,
      host: engineSocket.request.headers.host,
    });
  });

  io.on("connection", async (socket) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) throw new Error("No cookies");

      const { authToken } = cookie.parse(cookieHeader);
      if (!authToken) throw new Error("No token");

      const payload = jwt.verify(
        authToken,
        process.env.JWT_SECRET!
      ) as JWTPayload;

      const user = await findUserById(payload._id);
      if (!user) throw new Error("User not found");

      socket.join(user._id.toHexString());
      console.log("Socket authenticated:", user._id.toHexString());

    } catch (err) {
      socket.emit("unauthorized");
      socket.disconnect();
    }
  });

  eventListener.on("hire", ({ freelancerId, gig }) => {
    io.to(freelancerId).emit("hire", { gig, freelancerId });
  });

  return io;
};
