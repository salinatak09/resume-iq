import { FileText } from 'lucide-react';
import Link from 'next/link';

type AnalysisRowProps = {
  id: number;
  role: string;
  score: number;
};

export default function AnalysisRow({ id, role, score }: AnalysisRowProps) {
  // Determine dynamic badge colors based on the numerical score range
  const getScoreColor = (numScore: number) => {
    if (numScore >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (numScore >= 70) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="flex items-center justify-between py-4 hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
      <div className="flex items-center space-x-4">
        {/* Document Icon Graphic */}
        <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
          <FileText className="h-5 w-5" />
        </div>
        
        {/* Role Name */}
        <div>
          <h3 className="font-semibold text-gray-800 text-sm md:text-base">
            {role}
          </h3>
          <p className="text-xs text-gray-400">Analyzed recently</p>
        </div>
      </div>

      {/* Score Badge and Navigation Link */}
      <div className="flex items-center space-x-4">
        <span className={`text-sm font-semibold px-2.5 py-1 rounded-md border ${getScoreColor(score)}`}>
          {score}/100
        </span>
        
        {/* Direct Link out to full detailed report */}
        <Link 
          href={`/dashboard/analysis/${id || ''}`} 
          className="text-gray-400 hover:text-teal-600 transition-colors"
          title="View detailed feedback"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
