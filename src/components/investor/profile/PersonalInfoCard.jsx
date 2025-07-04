import { FaUser, FaEnvelope, FaPhoneAlt, FaIdCard } from "react-icons/fa";

export default function PersonalInfoCard({ investor, onEditClick }) {
  return (
    <div className="p-4 mb-6 flex-1 rounded-xl border ">
      <div className="flex items-center justify-between mb-4">
        <div className="card-heading text-primarycolor text-lg-override">Personal Information</div>
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
            <FaUser className="w-4 h-4 text-primarycolor" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Full Name</div>
            <div className="p-medium">{investor?.full_name || '-'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
            <FaEnvelope className="w-4 h-4 text-green-600" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Email Address</div>
            <div className="p-medium">{investor?.email || '-'} <span className="ml-1 text-green-500">&#10003;</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
            <FaPhoneAlt className="w-4 h-4 text-blue-600" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Mobile Number</div>
            <div className="p-medium">{investor?.mobile_number || '-'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
            <FaIdCard className="w-4 h-4 text-orange-500" />
          </span>
          <div>
            <div className="heading-main mb-0-override">PAN Number</div>
            <div className="p-medium">{investor?.pan_number || '-'} {investor?.pan_number && <span className="ml-1 text-green-500">&#10003;</span>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
