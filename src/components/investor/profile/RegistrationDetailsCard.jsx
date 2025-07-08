export default function RegistrationDetailsCard() {
  return (
    <div className="card mb-6 bg-primarycolor2">
      <div className="card-heading text-primarycolor mb-4">Registration Details</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-primarycolor" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
          </span>
          <div>
            <div className="font-bold-custom text-secondary">Source of Discovery</div>
            <div className="p-medium">Linkedin Referral</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </span>
          <div>
            <div className="font-bold-custom text-secondary">Member Since</div>
            <div className="p-medium">March 15, 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
