import { FaLock, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useState } from 'react';

const statusBadge = {
  Open: 'bg-green-100 text-green-700',
  'Closing Soon': 'bg-red-100 text-red-600',
  Closed: 'bg-gray-200 text-gray-600',
};

export default function LockedDeals({ deals = [] }) {
  const [dealsWithBookmarks, setDealsWithBookmarks] = useState(deals.map(deal => ({
    ...deal,
    bookmarked: false
  })));

  const handleBookmark = (dealId) => {
    setDealsWithBookmarks(dealsWithBookmarks.map(deal => 
      deal.id === dealId 
        ? { ...deal, bookmarked: !deal.bookmarked }
        : deal
    ));
  };

  return (
    <div className="">
      <div className="heading-section mb-4">Deals</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-28">
        {dealsWithBookmarks.map((deal) => (
          <div key={deal.id} className="card-bordered flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="card-heading">{deal.title}</h3>
              <span className={`badge ${statusBadge[deal.status] || 'bg-gray-100 text-gray-700'}`}>
                {deal.status}
              </span>
            </div>
            <p className="text-xs text-secondary3 mb-1">{deal.stage} • {deal.sector}</p>
            <p className="p-small mb-2 flex-1">{deal.summary}</p>
            <div className="flex flex-wrap gap-4 mb-3">
              <p className="text-xs text-secondary3"><span className="font-bold-custom">Ticket Size:</span> {deal.ticketSize}</p>
              <p className="text-xs text-secondary3"><span className="font-bold-custom">Expected IRR:</span> {deal.irr}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 gap-3">
              <button className="btn-primary flex-1">View Details</button>
              <button 
                className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${deal.bookmarked ? 'text-primarycolor' : 'text-secondary3'}`}
                onClick={() => handleBookmark(deal.id)}
                aria-label="Bookmark"
              >
                {deal.bookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 