import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import NotificationToast from '../components/NotificationToast';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on('hire', (data: any) => {
        const notification: Notification = {
          id: Date.now().toString(),
          message: `Congratulations! You've been hired for "${data.gig?.title || 'a gig'}"!`,
          type: 'success',
        };
        setNotifications(prev => [...prev, notification]);
      });

      return () => {
        socket.off('hire');
      };
    }
  }, [socket]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-900">{user?.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Socket Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Real-time Status</h2>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${connected ? 'text-green-700' : 'text-red-700'}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {connected 
              ? 'You will receive real-time notifications when you are hired for gigs.'
              : 'Connection lost. Real-time notifications are unavailable.'
            }
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/"
            className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
          >
            <div className="font-semibold">Browse Gigs</div>
            <div className="text-sm opacity-90">Find new opportunities</div>
          </a>
          <a
            href="/create-gig"
            className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 transition-colors"
          >
            <div className="font-semibold">Create Gig</div>
            <div className="text-sm opacity-90">Post a new project</div>
          </a>
          <a
            href="/my-gigs"
            className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600 transition-colors"
          >
            <div className="font-semibold">My Gigs</div>
            <div className="text-sm opacity-90">Manage your projects</div>
          </a>
          <a
            href="/my-bids"
            className="bg-orange-500 text-white p-4 rounded-lg text-center hover:bg-orange-600 transition-colors"
          >
            <div className="font-semibold">My Bids</div>
            <div className="text-sm opacity-90">Track your proposals</div>
          </a>
        </div>
      </div>

      {/* WebSocket Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">WebSocket Demo</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Connection Status</div>
              <div className="text-sm text-gray-600">
                Socket.io connection to server
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              connected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {connected ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>
              When someone hires you for a gig, you'll receive a real-time notification here.
              The notification system uses Socket.io for instant updates.
            </p>
          </div>
        </div>
      </div>

      {/* Render notifications */}
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default Dashboard;