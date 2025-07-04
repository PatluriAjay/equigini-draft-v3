import React from 'react';

// Custom date formatting function
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function ProfileDetails({ investor }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Personal Info */}
      <div>
        <div className="heading-section mb-2">Personal Information</div>
        <div className="p-medium mb-1"><span className="text-secondary block">Full Name</span><span>{investor.full_name || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Email Address</span><span>{investor.email || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Mobile Number</span><span>{investor.mobile_number || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">PAN Number</span><span>{investor.pan_number || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Investment Range</span><span>{investor.investment_range || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Preferred Sectors</span><span>{investor.preferred_sectors && investor.preferred_sectors.length > 0 ? investor.preferred_sectors.join(', ') : '-'}</span></div>
      </div>
      {/* Address Info */}
      <div>
        <div className="heading-section mb-2">Address Information</div>
        <div className="p-medium mb-1"><span className="text-secondary block">Address Line 1</span><span>{investor.address1 || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">City</span><span>{investor.city || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">State</span><span>{investor.state || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Postal Code</span><span>{investor.postal_code || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Country</span><span>{investor.country || '-'}</span></div>
      </div>
      {/* Account Info */}
      <div>
        <div className="heading-section mb-2">Account Information</div>
        <div className="p-medium mb-1"><span className="text-secondary block">Registration Date</span><span>{formatDate(investor.createdAt)}</span></div>
        {/* <div className="p-medium mb-1 text-secondary">
          <span className="text-secondary block">Last Login</span>
          <span>{investor.last_login_at
            ? new Date(investor.last_login_at).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : '-'}</span>
        </div> */}
        <div className="p-medium mb-1"><span className="text-secondary block">Verification Status</span><span className="">{investor.is_approved ? 'Approved' : 'Pending Review'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Geography</span><span>{investor.geography || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Investor Type</span><span>{investor.investor_type || '-'}</span></div>
        <div className="p-medium mb-1"><span className="text-secondary block">Source of Discovery</span><span>{investor.source_of_discovery || '-'}</span></div>
      </div>
    </div>
  );
} 