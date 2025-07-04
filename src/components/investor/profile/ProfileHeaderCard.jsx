import Image from "next/image";

export default function ProfileHeaderCard({ investor }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getVerificationStatus = () => {
    if (investor?.is_approved) {
      return {
        label: 'Verified',
        className: 'badge bg-green-100 text-green-800 text-xs flex items-center gap-1 badge-row w-fit'
      };
    } else {
      return {
        label: 'Pending Review',
        className: 'badge bg-yellow-100 text-yellow-800 text-xs flex items-center gap-1 badge-row w-fit'
      };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="flex flex-col sm:flex-row gap-6 bg-white rounded-xl border p-6 mb-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="heading-main font-primary text-secondary">{investor?.full_name || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className={verificationStatus.className}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span>{verificationStatus.label}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </span>
        <div>
          <div className="heading-main mb-0-override">Member Since</div>
          <div className="p-medium">{formatDate(investor?.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}
