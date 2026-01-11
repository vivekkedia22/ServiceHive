import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
}

const MyGigs: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gigs');
      // Filter gigs by current user (client-side filtering since backend doesn't have user-specific endpoint)
      const userGigs = response.data.data.filter((gig: any) => gig.ownerId === user?.id);
      setGigs(userGigs);
    } catch (err: any) {
      setError('Failed to fetch your gigs');
      console.error('Error fetching gigs:', err);
    } finally {
      setLoading(false);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
        <Link
          to="/create-gig"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Gig
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {gigs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            You haven't created any gigs yet.
          </div>
          <Link
            to="/create-gig"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Gig
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div key={gig.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {gig.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  gig.status === 'open' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {gig.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {gig.description}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold text-green-600">
                  ${gig.budget}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Posted {new Date(gig.createdAt).toLocaleDateString()}
                </div>
                <Link
                  to={`/gig/${gig.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;