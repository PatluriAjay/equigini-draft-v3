import { FaLock } from 'react-icons/fa';

export default function StickyVerificationBar() {
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 border border-bordercolor bg-white rounded-lg shadow-lg flex flex-col items-center justify-center py-4 px-6">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
        <FaLock className="text-2xl text-primarycolor" />
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-semibold text-secondary mb-1">Verification Required</h4>
          <p className="text-sm text-secondary3 mb-2 md:mb-0">
            Complete your verification to access deal details and investment opportunities
          </p>
        </div>
        <button className="btn-primary">Complete Verification</button>
      </div>
    </div>
  );
} 