import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Gig {
  id: string;
  title: string;
  budget: number;
  description: string;
  status: string;
}

interface Bid {
  id: string;
  message: string;
  status: string;
  gigId: Gig; // Now populated with full gig object
  freelancerId: string;
  createdAt: string;
}

const MyBids: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bids');
      setBids(response.data.data || []);
    } catch (err: any) {
      setError('Failed to fetch your bids');
      console.error('Error fetching bids:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bids</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {bids.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            You haven't submitted any bids yet.
          </div>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Available Gigs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {bid.gigId?.title || 'Unknown Gig'}
                  </h3>
                  <div className="text-sm text-gray-600 mb-2">
                    Budget: ${bid.gigId?.budget || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Status: <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(bid.status)}`}>
                  {bid.status}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Your Proposal:</h4>
                <p className="text-gray-700">{bid.message}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Submitted {new Date(bid.createdAt).toLocaleDateString()}
                </div>
                {bid.gigId && (
                  <Link
                    to={`/gig/${bid.gigId.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    View Gig
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;