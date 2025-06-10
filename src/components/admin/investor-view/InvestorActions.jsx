export default function InvestorActions({ status, onApprove, onReject, onDeactivate }) {
  if (status === "Pending Review") {
    return (
      <div className="flex gap-2">
        <button className="btn-primary" onClick={onApprove}>Approve</button>
        <button className="btn-secondary" onClick={onReject}>Reject</button>
      </div>
    );
  }
  if (status === "Verified") {
    return (
      <button className="btn-secondary" onClick={onDeactivate}>Deactivate</button>
    );
  }
  return null;
} 