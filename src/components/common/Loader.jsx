import React from 'react';

const Loader = ({ 
  text = "Loading...", 
  size = "default",
  className = "",
  showBackground = true 
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8", 
    large: "h-12 w-12"
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.default;

  const content = (
    <div className={`text-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${spinnerSize}`}></div>
      {/* <p className="mt-2 text-gray-600">{text}</p> */}
    </div>
  );

  if (showBackground) {
    return (
      <div className="bg-white rounded-lg p-8">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader; 