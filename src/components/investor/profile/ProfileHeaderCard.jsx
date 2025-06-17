import Image from "next/image";

export default function ProfileHeaderCard() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-xl border p-6 mb-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="heading-main font-primary text-secondary">John Anderson</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
           
            <span className="badge bg-green-100 text-green-800 text-xs flex items-center gap-1 badge-row w-fit ">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span> Verified</span>
            </span>
        </div>
       
      </div>
       <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </span>
          <div>
            <div className="heading-main mb-0-override">Member Since</div>
            <div className="p-medium">March 15, 2024</div>
          </div>
        </div>
    </div>
  );
}
