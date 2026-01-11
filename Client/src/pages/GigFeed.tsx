import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import GigCard from '../components/GigCard';
import SearchBar from '../components/SearchBar';

interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
}

const GigFeed: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGigs(searchTerm);
  }, [searchTerm]);

  const fetchGigs = async (title: string = '') => {
    try {
      setLoading(true);
      const params = title ? { title } : {};
      const response = await api.get('/gigs', { params });
      setGigs(response.data.data || []);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch gigs');
      console.error('Error fetching gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Gigs</h1>
        <div className="max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search gigs by title..."
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {gigs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm ? 'No gigs found matching your search.' : 'No gigs available at the moment.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GigFeed;