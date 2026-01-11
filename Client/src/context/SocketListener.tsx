import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface SocketListenerProps {
  children: React.ReactNode;
}

export const SocketListener: React.FC<SocketListenerProps> = ({ children }) => {
  const { socket } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (socket) {
      const handleHire = (data: any) => {
        console.log('Hire notification received:', data);
        showToast(`Congratulations! You've been hired for "${data.gig?.title || 'a gig'}"!`, 'success');
      };

      // Remove any existing listeners first
      socket.off('hire');
      socket.on('hire', handleHire);

      return () => {
        socket.off('hire', handleHire);
      };
    }
  }, [socket, showToast]);

  return <>{children}</>;
};