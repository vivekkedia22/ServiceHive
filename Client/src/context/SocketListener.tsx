import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { data } from "react-router-dom";

interface SocketListenerProps {
  children: React.ReactNode;
}

export const SocketListener: React.FC<SocketListenerProps> = ({ children }) => {
  const { socket } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (socket) {
      const handleHire = (data: any) => {
        console.log("Hire notification received:", data);
        showToast(
          `Congratulations! You've been hired for "${
            data.gig?.title || "a gig"
          }"!`,
          "success"
        );
      };
      const handleError = (data: any) => {
        console.log("Unauthorized error received:", data);
        showToast(`Error: ${data.message || "Unknown error"}`, "error");
      };

      // Remove any existing listeners first
      socket.off("hire");
      socket.on("hire", handleHire);
      socket.off("unauthorized");
      socket.on("unauthorized", handleError);
      return () => {
        socket.off("hire", handleHire);
        socket.off("unauthorized", handleError);
      };
    }
  }, [socket, showToast]);

  return <>{children}</>;
};
