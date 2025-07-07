"use client";

export default function PageLoader({ isLoading, text = "Loading..." }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-white/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primarycolor mx-auto mb-4"></div>
        {text && (
          <p className="text-gray-600 font-medium text-sm">{text}</p>
        )}
      </div>
    </div>
  );
} 