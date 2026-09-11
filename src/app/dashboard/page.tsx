import Link from 'next/link';
import StatCard from '@/components/StatCard';
import AnalysisRow from '@/components/AnalysisRow';


const Dashboard = () => {

  // Real apps would fetch this data from an API or database
  const pastAnalyses = [
    { id: 1, role: 'Software Engineer', score: 82 },
    { id: 2, role: 'Frontend Developer', score: 76 },
    { id: 3, role: 'Backend Developer', score: 71 },
  ];

  return (
    <div className="space-y-10 px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Latest Resume Score" value="78/100" type="score" />
        <StatCard title="Skills Identified" value="24" type="skills" />
      </div>

      {/* History Layout */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Analyses</h2>
          <Link
            href="/upload" 
            className="text-sm font-semibold bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Analyze New Resume
          </Link>
        </div>

        {/* List mapping over historical analyses */}
        <div className="divide-y divide-gray-100">
          {pastAnalyses.map((item) => (
            <AnalysisRow key={item.id} id={item.id} role={item.role} score={item.score} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard