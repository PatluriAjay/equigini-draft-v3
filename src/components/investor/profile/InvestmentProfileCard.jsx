import { FaUserTie, FaMoneyBillWave, FaGlobeAsia, FaTags } from "react-icons/fa";

export default function InvestmentProfileCard() {
  return (
    <div className="p-4 mb-6 flex-1 rounded-xl border ">
      <div className="flex items-center justify-between mb-4">
        <div className="card-heading text-primarycolor text-lg-override">Investment Profile</div>
        <button className="btn-secondary px-4 py-1 text-xs">Edit</button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
            <FaUserTie className="w-4 h-4 text-primarycolor" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Investor Type</div>
            {/* <div className="p-medium">High Net Worth Individual</div> */}
             <span className="badge bg-purple-100 text-primarycolor text-xs">HNWI Investor</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
            <FaMoneyBillWave className="w-4 h-4 text-green-600" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Investment Range</div>
            <div className="p-medium">$100K - $1M</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
            <FaGlobeAsia className="w-4 h-4 text-blue-600" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Geography</div>
            <div className="p-medium">India, Singapore</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center">
            <FaTags className="w-4 h-4 text-yellow-500" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Preferred Sectors</div>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="badge bg-purple-200 text-primarycolor">Fintech</span>
              <span className="badge bg-green-200 text-green-800">Healthcare</span>
              <span className="badge bg-blue-200 text-blue-800">E-commerce</span>
              <span className="badge bg-orange-200 text-orange-800">CleanTech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
