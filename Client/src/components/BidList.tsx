import React from 'react';
import BidItem from './BidItem';

interface Bid {
  id: string;
  message: string;
  status: string;
  freelancerId: string;
  createdAt: string;
}

interface BidListProps {
  bids: Bid[];
  onHire?: (bidId: string) => void;
  isOwner?: boolean;
}

const BidList: React.FC<BidListProps> = ({ bids, onHire, isOwner = false }) => {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bids yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Bids ({bids.length})</h3>
      {bids.map((bid) => (
        <BidItem
          key={bid.id}
          bid={bid}
          onHire={onHire}
          showHireButton={isOwner}
          isOwner={isOwner}
        />
      ))}
    </div>
  );
};

export default BidList;