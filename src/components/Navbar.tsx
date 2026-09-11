'use client';

import { LogIn, Menu, UserPlus, X } from 'lucide-react';
import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Placeholder for auth state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="w-full bg-teal-100 border-b border-gray-200 sticky top-0 z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-teal-700 tracking-tight">
              Resume IQ
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/auth" 
                  className="text-sm font-medium text-teal-600 px-4 py-2 rounded-md hover:bg-teal-700 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/auth?mode=signup" 
                  className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ): (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-600"
                >
                  Dashboard
                </Link>

                <Link
                  href="/resume"
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-600"
                >
                  My Resumes
                </Link>

                <Link
                  href="/profile"
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-600"
                >
                  Profile
                </Link>

                <button
                  type="button"
                  className="rounded-md px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  onClick={() => {
                    // TODO: logout
                    setIsAuthenticated(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button (Placeholder) */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="p-2 text-slate-500 transition-colors hover:text-teal-700"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={
                isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 transition-all duration-300 ease-in-out rotate-90" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

          </div>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-teal-100 py-4 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth?mode=login"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-600 hover:text-teal-50"
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </Link>

                  <Link
                    href="/auth?mode=signup"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-teal-600 hover:text-teal-50"
                  >
                    <UserPlus className="h-5 w-5" />
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-600"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/resume"
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-600"
                  >
                    My Resumes
                  </Link>

                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-600"
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      // TODO: logout
                      setIsAuthenticated(false);
                      closeMobileMenu();
                    }}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar;