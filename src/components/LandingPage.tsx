'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react'

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Placeholder for auth state
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
        Make Your Resume <span className="text-teal-600">Job-Ready</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Upload your resume and get AI-powered feedback in seconds to beat the ATS systems.
      </p>
      
      {/* Primary Call to Action */}
      <Link 
        href={ isAuthenticated ? "/dashboard" : "/auth"}
        className="bg-teal-600 text-white font-medium text-lg px-8 py-4 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 mb-12"
      >
        Analyze My Resume
      </Link>

      {/* Feature Checkmarks */}
      <ul className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-gray-700 font-medium">
        <li className="flex items-center gap-2">
          <CheckCircle size={20} color='teal'/> ATS Analysis
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle size={20} color='teal'/> Skill Analysis
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle size={20} color='teal'/> Job Matching
        </li>
      </ul>
    </div>
  )
}

export default LandingPage