
import React from 'react';

// Fix: Provide default values for containerClassName, inputClassName, and icon to make them optional.
const Input = ({ label, id, error, containerClassName = '', inputClassName = '', icon = null, type = "text", ...props }) => {
  const hasIcon = Boolean(icon);
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative"> {/* Wrapper for icon and input */}
        {hasIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`mt-1 block w-full ${hasIcon ? 'pl-10' : 'px-3'} py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm hover:shadow-md transition-shadow duration-150 ease-in-out ${inputClassName}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;