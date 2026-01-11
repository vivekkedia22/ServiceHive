import React from 'react';
import { Link } from 'react-router-dom';

interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
}

interface GigCardProps {
  gig: Gig;
}

const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
      
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold text-green-600">
          ${gig.budget}
        </div>
        <Link
          to={`/gig/${gig.id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          View Details
        </Link>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Posted {new Date(gig.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default GigCard;