import { FaUserCheck, FaUserClock, FaExclamationTriangle } from 'react-icons/fa';

const statusConfig = {
  "Pending Review": {
    icon: FaUserClock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    message: "Your profile is under review. We'll notify you once verified.",
  },
  "Rejected": {
    icon: FaExclamationTriangle,
    color: "text-red-500",
    bgColor: "bg-red-50",
    message: "Your profile needs attention. Please review the feedback and resubmit.",
  },
  "Verified": {
    icon: FaUserCheck,
    color: "text-green-500",
    bgColor: "bg-green-50",
    message: "Your profile is verified. You can now access all features.",
  },
};

export default function ProfileStatus({ status = "Pending Review" }) {
  const config = statusConfig[status] || statusConfig["Pending Review"];
  const Icon = config.icon;

  return (
    <div className="mb-8">
      <div className={`card-bordered p-6`}>
        <div className="flex items-start gap-4">
          <div className={`${config.color} text-3xl`}>
            <Icon />
          </div>
          <div className="flex-1">
            <h3 className="card-heading mb-2">{status}</h3>
            <p className="text-secondary3 mb-4">{config.message}</p>
            {status === "Rejected" && (
              <button className="btn-primary">Review Feedback</button>
            )}
            {status === "Pending Review" && (
              <button className="btn-secondary">View Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 