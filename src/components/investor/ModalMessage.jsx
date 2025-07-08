import React from "react";

export default function ModalMessage({ show, onClose, type = "success", message, onConfirm, confirmText = "Confirm", showCancel = false, title }) {
  if (!show) return null;
  
  // Determine the heading - use custom title if provided, otherwise use default based on type
  const getHeading = () => {
    if (title) return title;
    return type === "success" ? "Success" : type === "confirm" ? "Confirm Delete" : "Error";
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className={`mb-4 flex justify-center`}>
          {type === "success" ? (
            <span className="inline-block w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl">✓</span>
          ) : type === "confirm" ? (
            <span className="inline-block w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl">!</span>
          ) : (
            <span className="inline-block w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl">!</span>
          )}
        </div>
        <div className="text-lg font-semibold mb-2 text-primarycolor">
          {getHeading()}
        </div>
        <div className="text-sm text-secondary3 mb-4">{message}</div>
        {showCancel && onConfirm ? (
          <div className="flex gap-3 justify-center">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            className="btn-primary w-full"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
