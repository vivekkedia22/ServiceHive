import React from 'react';

interface Bid {
  id: string;
  message: string;
  status: string;
  freelancerId: string;
  createdAt: string;
}

interface BidItemProps {
  bid: Bid;
  onHire?: (bidId: string) => void;
  showHireButton?: boolean;
  isOwner?: boolean;
}

const BidItem: React.FC<BidItemProps> = ({ bid, onHire, showHireButton = false, isOwner = false }) => {
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

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="text-gray-800 mb-2">{bid.message}</p>
          <div className="text-sm text-gray-500">
            Submitted {new Date(bid.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="ml-4 flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bid.status)}`}>
            {bid.status}
          </span>
          {showHireButton && isOwner && bid.status === 'pending' && onHire && (
            <button
              onClick={() => onHire(bid.id)}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
            >
              Hire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidItem;