"use client";

import Login from '@/components/Login';
import Signup from '@/components/Signup';
import { useSearchParams, useRouter } from 'next/navigation';
import {  } from 'react';

const Auth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Default to 'login' if no mode is specified
  const mode = searchParams.get('mode') || 'login';

  // Smoothly change the URL parameter (mode) without a full page reload
  const handleModeChange = (newMode: string) => {
    router.push(`/auth?mode=${newMode}`, {scroll: false});
  }

  return (
    <div className="dark:bg-black">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-6 sticky top-16 z-100">
        <button
          onClick={() => handleModeChange('login')}
          className={`w-1/2 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer bg-teal-50 ${
            mode === 'login'
              ? 'border-teal-600 text-teal-600'
              : 'border-none text-gray-500 hover:text-gray-700 active:bg-teal-100'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => handleModeChange('signup')}
          className={`w-1/2 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer bg-teal-50 ${
            mode === 'signup'
              ? 'border-teal-600 text-teal-600'
              : 'border-none text-gray-500 hover:text-gray-700 active:bg-teal-100'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form Content Wrapper */}
      <div className="mt-4">
        {mode === 'login' ? (
          <Login  />
        ) : (
          <Signup  />
        )}
      </div>
    </div>
  )
}

export default Auth