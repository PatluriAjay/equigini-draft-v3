export default function AccountSettingsCard() {
  return (
    <div className="card mb-6 bg-gradient-to-br from-secondary to-gray-900 text-white">
      <div className="card-heading text-white mb-4">Account Settings</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-primarycolor" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </span>
          <span className="p-medium text-white">Notifications</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 0V7m0 4v4m0 0a9 9 0 110-18 9 9 0 010 18z" /></svg>
          </span>
          <span className="p-medium text-white">Security</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z" /></svg>
          </span>
          <span className="p-medium text-white">Documents</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h2l2 2h3a2 2 0 012 2v11a2 2 0 01-2 2z" /></svg>
          </span>
          <span className="p-medium text-white">Help</span>
        </div>
      </div>
    </div>
  );
}
