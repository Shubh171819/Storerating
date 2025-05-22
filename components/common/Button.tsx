
import React from 'react';

// Fix: Provide a default value for className to make it optional.
const Button = ({ children, variant = 'primary', isLoading = false, fullWidth = false, className = '', ...props }) => {
  const baseStyles = "font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150";
  const sizeStyles = "px-4 py-2 text-sm";
  
  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500";
      break;
    case 'secondary':
      variantStyles = "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";
      break;
    case 'danger':
      variantStyles = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      break;
    case 'outline':
      variantStyles = "border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500";
      break;
  }

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyles} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;