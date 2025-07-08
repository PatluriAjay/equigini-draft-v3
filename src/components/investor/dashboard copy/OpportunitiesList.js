import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { MdFileDownload } from 'react-icons/md';

export default function OpportunitiesList({ opportunities: initialOpportunities, onBookmark }) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 ">
      {initialOpportunities && initialOpportunities.length > 0 ? initialOpportunities.map((op) => (
        <div key={op.id} className="max-w-md rounded-2xl shadow-lg border border-gray-200 p-4 bg-white text-black flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-bold text-[#A330AE]">{op.title}</h2>
              <p className="text-xs text-gray-600">
                <span className="font-bold-custom">Sector:</span> {op.sector}
              </p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Stage</p>
              <p className="font-medium text-black text-xs">{op.stage}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Status</p>
              <p className="font-medium text-black text-xs">{op.status}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-700">{op.summary}</p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Min Investment</p>
              <p className="font-medium text-black text-xs">{op.ticketSize}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Expected IRR</p>
              <p className="font-medium text-black text-xs">{op.irr}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <button className="w-full bg-[#A330AE] hover:bg-[#8d2899] text-white py-2 rounded-xl font-semibold text-sm" onClick={() => router.push(`/investor/deals/${op.title}`)}>
              View Details
            </button>
            <button
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${op.bookmarked ? 'text-primarycolor' : 'text-secondary3'}`}
              onClick={() => onBookmark(op.id)}
              aria-label="Bookmark"
            >
              {op.bookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button className="btn-primary flex-1 mt-2">Download Teaser Document</button>
          </div>
        </div>
      )) : (
        <p className="col-span-full p-small text-secondary3">No opportunities found.</p>
      )}
    </div>
  );
}