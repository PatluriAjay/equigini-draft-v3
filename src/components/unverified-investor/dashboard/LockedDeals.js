import { FaLock, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useState } from 'react';
import { MdFileDownload } from 'react-icons/md';
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
      <div className="heading-section mb-4">Latest Deals</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-28">
        {dealsWithBookmarks.map((deal) => (
          <div key={deal.id} className="card-bordered flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="card-heading">{deal.title}</h3>
            </div>
             <div className="flex items-center gap-2 ">
                <p className="text-xs font-bold-custom text-secondary3">
                  Teaser Document:
                </p>
                <button className="p-2 rounded-full">
                  <MdFileDownload className="w-5 h-5 text-black" />
                </button>
            </div>
            {/* Blur all except title */}
            <div className="flex-1 filter blur-sm select-none pointer-events-none">
              <p className="text-xs text-secondary3 mb-2"><span className="font-bold-custom">Sector:</span> {deal.sector}</p>
              <p className="text-xs text-secondary3 mb-2"><span className="font-bold-custom">Stage:</span> {deal.stage} </p>
              <p className="text-xs text-secondary3 mb-2"><span className="font-bold-custom">Status:</span> {deal.status}</p>
              <p className="p-small mb-2 flex-1">{deal.summary}</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-xs text-secondary3 font-medium">Min Investment</div>
                  <div className="">{deal.ticketSize}</div>
                </div>
                <div>
                  <div className="text-xs text-secondary3 font-medium">Expected IRR</div>
                  <div className="">{deal.irr}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 gap-3">
                <button className="btn-primary flex-1" onClick={() => alert(`Viewing details for ${deal.title}`)}>View Details</button>
                <button 
                  className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${deal.bookmarked ? 'text-primarycolor' : 'text-secondary3'}`}
                  onClick={() => handleBookmark(deal.id)}
                  aria-label="Bookmark"
                >
                  {deal.bookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
                </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}