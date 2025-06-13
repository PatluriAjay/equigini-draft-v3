import { FaLock, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { useState } from "react";

export default function DealsGrid({
  deals: initialDeals,
  onVerify,
  onView,
  isUnverified = false,
  isSavedDeals = false,
}) {
  const [deals, setDeals] = useState(
    initialDeals.map((deal) => ({
      ...deal,
      bookmarked: isSavedDeals ? true : false,
    }))
  );

  const handleBookmark = (dealId) => {
    setDeals(
      deals.map((deal) =>
        deal.id === dealId ? { ...deal, bookmarked: !deal.bookmarked } : deal
      )
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {deals && deals.length > 0 ? (
        deals.map((deal) => (
          <div key={deal.id} className="card-bordered flex flex-col h-full">
            <div className="flex items-center justify-between ">
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
            {/* Blur all except title for unverified investors */}
            {isUnverified ? (
              <div className="flex-1 filter blur-sm select-none pointer-events-none">
                <p className="text-xs text-secondary3 mb-2">
                  <span className="font-bold-custom">Sector:</span>{" "}
                  {deal.sector}
                </p>
                <p className="text-xs text-secondary3 mb-2">
                  <span className="font-bold-custom">Stage:</span> {deal.stage}{" "}
                </p>
                <p className="text-xs text-secondary3 mb-2">
                  <span className="font-bold-custom">Status:</span>{" "}
                  {deal.status}
                </p>
                <p className="p-small mb-2 flex-1">{deal.summary}</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="text-xs text-secondary3 font-medium">
                      Min Investment
                    </div>
                    <div className="">{deal.ticketSize}</div>
                  </div>
                  <div>
                    <div className="text-xs text-secondary3 font-medium">
                      Expected IRR
                    </div>
                    <div className="">{deal.irr}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-2 gap-3">
                  <button
                    className="btn-primary flex-1"
                    onClick={() => onView && onView(deal.slug)}
                  >
                    View Details
                  </button>
                  <button
                    className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                      deal.bookmarked ? "text-primarycolor" : "text-secondary3"
                    }`}
                    onClick={() => handleBookmark(deal.id)}
                    aria-label="Bookmark"
                  >
                    {deal.bookmarked ? (
                      <FaBookmark size={18} />
                    ) : (
                      <FaRegBookmark size={18} />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-secondary3 mb-2">
                  <span className="font-bold-custom">Sector:</span>{" "}
                  {deal.sector}
                </p>
                <p className="text-xs text-secondary3 mb-2">
                  <span className="font-bold-custom">Stage:</span> {deal.stage}{" "}
                </p>
                <p className="text-xs text-secondary3 mb-2">
                  <span className="font-bold-custom">Status:</span>{" "}
                  {deal.status}
                </p>
                <p className="p-small mb-2">{deal.summary}</p>
                <div className="grid grid-cols-2 gap-4 ">
                  <div className="text-xs text-secondary3 mb-2">
                    <p className="font-bold-custom">Min Investment</p>
                    <p className="">{deal.ticketSize}</p>
                  </div>
                  <div className="text-xs text-secondary3 mb-2">
                    <p className="font-bold-custom">Expected IRR</p>
                    <p className="">{deal.irr}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto  gap-3">
                  <button
                    className="btn-primary flex-1"
                    onClick={() => onView && onView(deal.slug)}
                  >
                    View Details
                  </button>
                  <button
                    className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                      deal.bookmarked ? "text-primarycolor" : "text-secondary3"
                    }`}
                    onClick={() => handleBookmark(deal.id)}
                    aria-label="Bookmark"
                  >
                    {deal.bookmarked ? (
                      <FaBookmark size={18} />
                    ) : (
                      <FaRegBookmark size={18} />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="col-span-full p-small text-secondary3">No deals found.</p>
      )}
      {/* Deal Card */}
      <div className="max-w-md rounded-2xl shadow-lg border border-gray-200 p-4 bg-white text-black">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-[#A330AE]">
              GreenEnergy Ventures
            </h2>
            <p className="text-xs text-gray-600">
              <span className="font-bold-custom">Sector:</span> CleanTech
            </p>
          </div>
        </div>
        {/* Stage & Status */}
        <div className="flex gap-4 mt-4">
          <span className="text-xs bg-[#A330AE] text-white px-3 py-1 rounded-full">
            Stage: Growth
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Status: Open
          </span>
        </div>
        {/* Description */}
        <p className="mt-4 text-xs text-gray-700">
          Leading renewable energy solutions provider with operations across 15
          countries and growing market presence.
        </p>
        {/* Investment & IRR */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Min Investment</p>
            <p className="font-medium text-black text-xs">₹1Cr - ₹10Cr</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Expected IRR</p>
            <p className="font-medium text-black text-xs">20-25%</p>
          </div>
        </div>
        {/* Teaser Document visible to all */}
        <div className="flex items-center gap-2 ">
          <p className="text-xs font-bold-custom text-secondary3">
            Teaser Document:
          </p>
          <button className="p-2 rounded-full">
            <MdFileDownload className="w-5 h-5 text-black" />
          </button>
        </div>
        {/* View Details Button and Bookmark Button in single line */}
        <div className="flex items-center gap-4 mt-6">
          <button className="w-full bg-[#A330AE] hover:bg-[#8d2899] text-white py-2 rounded-xl font-semibold text-sm">
            View Details
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Bookmark"
          >
            <FaBookmark size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-md rounded-2xl shadow-lg border border-gray-200 p-4 bg-white text-black">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-[#A330AE]">
              GreenEnergy Ventures
            </h2>
            <p className="text-xs text-gray-600">
              <span className="font-bold-custom">Sector:</span> CleanTech
            </p>
          </div>
        </div> 
        {/* Stage & Status */}
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Stage</p>
            <p className="font-medium text-black text-xs">Growth</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Status</p>
            <p className="font-medium text-black text-xs">Open</p>
          </div>
        </div>
        {/* Description */}
        <p className="mt-2 text-xs text-gray-700">
          Leading renewable energy solutions provider with operations across 15
          countries and growing market presence.
        </p>
        {/* Investment & IRR */}
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Min Investment</p>
            <p className="font-medium text-black text-xs">₹1Cr - ₹10Cr</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Expected IRR</p>
            <p className="font-medium text-black text-xs">20-25%</p>
          </div>
        </div>
        {/* View Details Button and Bookmark Button in single line */}
        <div className="flex items-center gap-4 mt-3">
          <button className="w-full bg-[#A330AE] hover:bg-[#8d2899] text-white py-2 rounded-xl font-semibold text-sm">
            View Details
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Bookmark"
          >
            <FaBookmark size={18} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button className="btn-primary flex-1 mt-2 ">Download Teaser Document</button>
        </div>
      </div>
    </div>
  );
}
