"use client";

export default function PageLoader({ isLoading, }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-white/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="animate-spin rounded-full border-b-2 border-blue-600 mx-auto h-12 w-12"></div>
      </div>
    </div>
  );
} 