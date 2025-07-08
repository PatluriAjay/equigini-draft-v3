export default function InvestorActions({ status, onApprove, onReject, onDeactivate }) {
  
  // For pending investors, show approve/reject options
  if (status === "Pending Review" || status === "Unverified") {
    return (
      <div className="flex gap-2">
        <button className="btn-primary" onClick={onApprove}>Approve</button>
        <button className="btn-secondary" onClick={onReject}>Reject</button>
      </div>
    );
  }
  
  return null;
} 