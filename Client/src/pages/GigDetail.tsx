import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BidList from '../components/BidList';

interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  ownerId: string;
  createdAt: string;
}

interface Bid {
  id: string;
  message: string;
  status: string;
  freelancerId: string;
  createdAt: string;
}

const GigDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    if (id) {
      fetchGigDetails();
    }
  }, [id]);

  const fetchGigDetails = async () => {
    try {
      setLoading(true);
      // Fetch all gigs and find the specific one
      const gigResponse = await api.get('/gigs');
      const foundGig = gigResponse.data.data.find((g: Gig) => g.id === id);
      
      if (!foundGig) {
        setError('Gig not found or already assigned');
        return;
      }
      
      setGig(foundGig);

      // If user is the owner, fetch bids
      if (user && foundGig.ownerId === user.id) {
        try {
          const bidsResponse = await api.get(`/bids/${id}`);
          setBids(bidsResponse.data.data || []);
        } catch (bidErr: any) {
          if (bidErr.response?.status !== 401) {
            console.error('Error fetching bids:', bidErr);
          }
        }
      }
    } catch (err: any) {
      setError('Failed to fetch gig details');
      console.error('Error fetching gig:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidMessage.trim()) return;

    setSubmittingBid(true);
    setBidError('');

    try {
      await api.post('/bids', {
        gigId: id,
        message: bidMessage,
      });
      setBidMessage('');
      showToast('Bid submitted successfully!', 'success');
    } catch (err: any) {
      setBidError(err.response?.data?.message || 'Failed to submit bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleHireBid = async (bidId: string) => {
    try {
      await api.patch(`/bids/${bidId}/hire`);
      
      // Optimistic update
      setBids(prevBids => 
        prevBids.map(bid => 
          bid.id === bidId 
            ? { ...bid, status: 'hired' }
            : { ...bid, status: 'rejected' }
        )
      );
      
      if (gig) {
        setGig({ ...gig, status: 'assigned' });
      }
      
      showToast('Freelancer hired successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to hire freelancer: ' + (err.response?.data?.message || 'Unknown error'), 'error');
      // Refresh data on error
      fetchGigDetails();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Gig not found'}
        </div>
      </div>
    );
  }

  const isOwner = user && gig.ownerId === user.id;
  const canBid = user && !isOwner && gig.status === 'open';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${
            gig.status === 'open' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {gig.status}
          </span>
        </div>
        
        <div className="text-2xl font-bold text-green-600 mb-4">
          Budget: ${gig.budget}
        </div>
        
        <div className="text-gray-700 mb-6 whitespace-pre-wrap">
          {gig.description}
        </div>
        
        <div className="text-sm text-gray-500">
          Posted {new Date(gig.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Bid form for non-owners */}
      {canBid && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit Your Bid</h2>
          <form onSubmit={handleSubmitBid}>
            {bidError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {bidError}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 mb-2">
                Your Proposal
              </label>
              <textarea
                id="bidMessage"
                rows={4}
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your approach, experience, and why you're the right fit for this project..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingBid}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {submittingBid ? 'Submitting...' : 'Submit Bid'}
            </button>
          </form>
        </div>
      )}

      {/* Bids list for owners */}
      {isOwner && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <BidList 
            bids={bids} 
            onHire={handleHireBid}
            isOwner={true}
          />
        </div>
      )}

      {/* Message for non-owners when gig is closed */}
      {!isOwner && gig.status !== 'open' && (
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <div className="text-gray-600">
            This gig is no longer accepting bids.
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetail;