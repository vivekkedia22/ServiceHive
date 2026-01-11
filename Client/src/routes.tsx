import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import GigFeed from './pages/GigFeed';
import GigDetail from './pages/GigDetail';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';
import Dashboard from './pages/Dashboard';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <Register />} 
      />
      
      {/* Public gig feed */}
      <Route path="/" element={<GigFeed />} />
      <Route path="/gig/:id" element={<GigDetail />} />
      
      {/* Protected routes */}
      <Route 
        path="/create-gig" 
        element={
          <ProtectedRoute>
            <CreateGig />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-gigs" 
        element={
          <ProtectedRoute>
            <MyGigs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-bids" 
        element={
          <ProtectedRoute>
            <MyBids />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;