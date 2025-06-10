import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statusBadge = {
  Open: 'bg-green-100 text-green-700',
  'Closing Soon': 'bg-red-100 text-red-600',
  Closed: 'bg-gray-200 text-gray-600',
};

export default function OpportunitiesList({ opportunities: initialOpportunities, onBookmark }) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState(initialOpportunities.map(op => ({
    ...op,
    bookmarked: false
  })));

  const handleBookmark = (opId) => {
    setOpportunities(opportunities.map(op => 
      op.id === opId 
        ? { ...op, bookmarked: !op.bookmarked }
        : op
    ));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {opportunities && opportunities.length > 0 ? opportunities.map((op) => (
        <div key={op.id} className="card-bordered flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="card-heading">{op.title}</h3>
            <span className={`badge ${statusBadge[op.status] || 'bg-gray-100 text-gray-700'}`}>{op.status}</span>
          </div>
          <p className="text-xs text-secondary3 mb-1">{op.stage} • {op.sector}</p>
          <p className="p-small mb-2 flex-1">{op.summary}</p>
          <div className="flex flex-wrap gap-4 mb-3">
            <p className="text-xs text-secondary3"><span className="font-bold-custom">Ticket Size:</span> {op.ticketSize}</p>
            <p className="text-xs text-secondary3"><span className="font-bold-custom">Expected IRR:</span> {op.irr}</p>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2 gap-2">
            <button className="btn-primary flex-1" onClick={() => router.push(`/investor/deals/${op.title}`)}>View Details</button>
            <button 
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${op.bookmarked ? 'text-primarycolor' : 'text-secondary3'}`}
              onClick={() => handleBookmark(op.id)}
              aria-label="Bookmark"
            >
              {op.bookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
            </button>
          </div>
        </div>
      )) : (
        <p className="col-span-full p-small text-secondary3">No opportunities found.</p>
      )}
    </div>
  );
} 