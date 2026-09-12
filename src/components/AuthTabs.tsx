"use client";

import { usePathname, useRouter } from 'next/navigation';

const AuthTabs = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isLogin = pathname === "/auth/login";
  const isSignup = pathname === "/auth/signup";

  // Smoothly change the URL parameter (mode) without a full page reload
  const handleModeChange = (newMode: string) => {
    router.replace(`/auth/${newMode}`, {scroll: false});
  }

  return (
    <div className="flex border-b border-gray-200 mb-6 sticky top-16 z-50">
      <button
        onClick={() => handleModeChange('login')}
        className={`w-1/2 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer bg-teal-50 ${
          isLogin
            ? 'border-teal-600 text-teal-600'
            : 'border-none text-gray-500 hover:text-gray-700 active:bg-teal-100'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => handleModeChange('signup')}
        className={`w-1/2 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer bg-teal-50 ${
          isSignup
            ? 'border-teal-600 text-teal-600'
            : 'border-none text-gray-500 hover:text-gray-700 active:bg-teal-100'
        }`}
      >
        Sign Up
      </button>
    </div>

    // <div className="dark:bg-black">
    //   {/* Tab Headers */}
    //   {/* Form Content Wrapper */}
    //   {/* <div className="mt-4">
    //     {mode === 'login' ? (
    //       <Login  />
    //     ) : (
    //       <Signup  />
    //     )}
    //   </div> */}
    // </div>
  )
}

export default AuthTabs;