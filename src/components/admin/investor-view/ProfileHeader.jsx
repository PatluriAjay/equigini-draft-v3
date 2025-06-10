import React from 'react';

const statusMap = {
  pending_review: { label: 'Pending Review', color: 'badge bg-yellow-100 text-yellow-800' },
  unverified: { label: 'Unverified', color: 'badge bg-red-100 text-red-800' },
  verified: { label: 'Verified', color: 'badge bg-green-100 text-green-800' },
  deactivated: { label: 'Deactivated', color: 'badge bg-gray-200 text-gray-600' },
  active: { label: 'Active', color: 'badge bg-green-100 text-green-800' },
};

export default function ProfileHeader({ investor, source = 'management' }) {
  const handleApprove = () => {
    // TODO: Implement approve functionality
    console.log('Approving investor:', investor.id);
  };

  const handleReject = () => {
    // TODO: Implement reject functionality
    console.log('Rejecting investor:', investor.id);
  };

  const handleDeactivate = () => {
    // TODO: Implement deactivate functionality
    console.log('Deactivating investor:', investor.id);
  };

  return (
    <div className="bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6 pb-0 ">
      <div className="flex items-center gap-4">
        {/* <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-primarycolor">
          {investor.full_name?.[0]}
        </div> */}
        <div>
          <div className="heading-main mb-1">{investor.full_name}</div>
          <div className="p-medium mb-2">{investor.email}</div>
          {/* <div className="flex flex-wrap gap-2">
            <span className={statusMap[investor.status]?.color}>{statusMap[investor.status]?.label}</span>
            <span className="badge bg-blue-100 text-blue-800">{investor.investor_type}</span>
            <span className={`badge ${source === 'approval' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-800'}`}>{source === 'approval' ? 'NDA Not Signed' : 'NDA Signed'}</span>
          </div> */}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        {source === 'approval' && (
          <>
            <button className="btn-primary" onClick={handleApprove}>Approve</button>
            <button className="btn-secondary" onClick={handleReject}>Reject</button>
          </>
        )}
        {source === 'management' && (
          <button className="btn-tertiary" onClick={handleDeactivate}>Deactivate</button>
        )}
      </div>
    </div>
  );
} 