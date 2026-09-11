import { Gauge } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  type: 'score' | 'skills'; // Define the type as a union of specific strings
};

const StatCard = ({ title, value, type } : StatCardProps) => {
  // Define styles dynamically based on the card type
  const isScore = type === 'score';
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="mt-2 text-3xl font-bold text-gray-950 tracking-tight">
          {value}
        </p>
      </div>

      {/* Dynamic Visual Icons for Score vs Skills */}
      <div className={`p-3 rounded-lg ${isScore ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
        {isScore ? (
          // Gauge/Score Icon
          <Gauge className="h-6 w-6" />
        ) : (
          // Lightbulb/Skills Icon
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )}
      </div>
    </div>
  );
}

export default StatCard;