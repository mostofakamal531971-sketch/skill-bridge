"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

const Unauthorized = () => {
  const navigate = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-lg">
        {/* Icon / Illustration */}
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-500 mb-8">
          Sorry, you don't have the necessary permissions to view this page. 
          Please contact your administrator if you believe this is an error.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate.back()}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
