import { FaUserTie, FaMoneyBillWave, FaGlobeAsia, FaTags } from "react-icons/fa";

export default function InvestmentProfileCard({ investor, onEditClick, sectors = [] }) {
  // Helper function to get sector name by ID
  const getSectorName = (id) => {
    const found = sectors.find(s => s._id === id || s.value === id);
    return found ? found.name : id;
  };

  const sectorIds = Array.isArray(investor?.preferred_sectors) ? investor.preferred_sectors : [];

  return (
    <div className="p-4 mb-6 flex-1 rounded-xl border ">
      <div className="flex items-center justify-between mb-4">
        <div className="card-heading text-primarycolor text-lg-override">Investment Profile</div>
        <button 
          onClick={onEditClick}
          className="btn-secondary px-4 py-1 text-xs hover:bg-primarycolor hover:text-white transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
            <FaUserTie className="w-4 h-4 text-primarycolor" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Investor Type</div>
            <span className="badge bg-purple-100 text-primarycolor text-xs">{investor?.investor_type || 'Not specified'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
            <FaMoneyBillWave className="w-4 h-4 text-green-600" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Investment Range</div>
            <div className="p-medium">{investor?.investment_range || 'Not specified'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
            <FaGlobeAsia className="w-4 h-4 text-blue-600" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Geography</div>
            <div className="p-medium">{investor?.geography || 'Not specified'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center">
            <FaTags className="w-4 h-4 text-yellow-500" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Preferred Sectors</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {sectorIds.length > 0 ? (
                sectorIds.map((sectorId, index) => (
                  <span key={index} className="badge bg-purple-200 text-primarycolor">{getSectorName(sectorId)}</span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No sectors specified</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
