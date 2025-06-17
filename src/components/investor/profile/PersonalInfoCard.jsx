import { FaUser, FaEnvelope, FaPhoneAlt, FaIdCard } from "react-icons/fa";

export default function PersonalInfoCard() {
  return (
    <div className="p-4 mb-6 flex-1 rounded-xl border ">
      <div className="flex items-center justify-between mb-4">
        <div className="card-heading text-primarycolor text-lg-override">Personal Information</div>
        <button className="btn-secondary px-4 py-1 text-xs">Edit</button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
            <FaUser className="w-4 h-4 text-primarycolor" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Full Name</div>
            <div className="p-medium">John Anderson</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
            <FaEnvelope className="w-4 h-4 text-green-600" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Email Address</div>
            <div className="p-medium">john.anderson@email.com <span className="ml-1 text-green-500">&#10003;</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
            <FaPhoneAlt className="w-4 h-4 text-blue-600" />
          </span>
          <div>
            <div className="heading-main mb-0-override">Mobile Number</div>
            <div className="p-medium">+91 88765 43210</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
            <FaIdCard className="w-4 h-4 text-orange-500" />
          </span>
          <div>
            <div className="heading-main mb-0-override">PAN Number</div>
            <div className="p-medium">ABCDE1234F <span className="ml-1 text-green-500">&#10003;</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
