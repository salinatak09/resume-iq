import { getResumeAnalysisById } from "@/actions/analysis-actions";
import AnalysisSection from "@/ui/AnalysisSection";
import ScoreCard from "@/ui/ScoreCard";
import { AlertTriangle, BicepsFlexed, Check, CircleAlert, Lightbulb, WandSparkles } from "lucide-react";
import Link from "next/link";
import KeywordBadge from "@/ui/KeywordBadge";
import { getScoreColor } from "@/lib/utils";

interface PageProps {
  params: Promise<{ resumeId: string; analysisId: string }>;
}

export default async function AnalysisResultPage({ params }: PageProps) {
  const { resumeId, analysisId } = await params;
  
  // Fetch analysis data from MongoDB server action
  const { analysis, success, error } = await getResumeAnalysisById(analysisId, resumeId);
  const isTargeted = analysis?.analysisType === "targeted";
  
  if(!success){
    // alert(error);
    console.log(error);
  }

  const scoreClasses = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    rose: 'bg-rose-50 border-rose-100 text-rose-700'
  }

  return (
    <div className="mx-auto max-w-6xl text-sm">
      {/* Navigation breadcrumb */}
      <Link
        href={`/resumes/${resumeId}`}
        className="font-medium text-slate-500 hover:text-teal-600 transition-colors"
      >
        ← Back to Resume Analysis Hub
      </Link>

      {/* Header */}
      <div className="mt-4">
        <p className="font-semibold uppercase tracking-wider text-teal-600">
          {isTargeted ? "Job Target" :  "Standalone"} Resume Analysis
        </p>
        <p className="text-slate-500">
          An overview of your resume performance and improvement areas.
        </p>
      </div>
      
      {/* Job Match Score Card */}
      { isTargeted && 
        <div className="bg-white mt-6 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{analysis?.jobTitle}</h2>
            <p className="text-sm text-slate-500 mt-1">Evaluated against {analysis?.company}'s job description</p>
          </div>
          <div className={`flex items-center gap-4 border px-6 py-4 rounded-xl ${scoreClasses[getScoreColor(analysis?.jobMatchScore || 0)]}`}>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider">Match Score</div>
              <div className="text-3xl font-black">{analysis?.jobMatchScore}%</div>
            </div>
          </div>
        </div>
      }

      {/* Scores */}
      <div className="grid gap-5 sm:grid-cols-2 mt-6">
        <ScoreCard title="Resume Score" score={analysis?.overallScore || 0} />
        {isTargeted ? 
          <ScoreCard title="ATS Score" score={analysis?.atsScore || 0} />
        :
          // {/* Format and Structure Rating */}
          <section className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Format rating</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{analysis?.formattingAndStructureRating}</p>
          </section>
        }
      </div>

      {/* Summary */}
      <section className="mt-6 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Summary</h2>
        <p className="mt-3 leading-relaxed text-slate-600">{analysis?.summary}</p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Skills */}
        <section className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Skills</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {analysis?.skills.map((skill) => (
              <KeywordBadge 
                key={skill}
                skill={skill} 
                icon={<Check className="w-4 h-4"/>}
                color="emerald"
              />
            ))}
          </div>
        </section>

        {/* Missing or recommended Kaywords */}
        <section className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{isTargeted ? "Missing" : "Recommended"} Keywords</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {analysis?.missingKeywords.map((skill) => (
              <KeywordBadge
                key={skill}
                skill={skill}
                icon={isTargeted ? <CircleAlert className="w-4 h-4"/> : <Lightbulb className="w-4 h-4"/>}
                color={isTargeted ? "amber" : "teal"}
              />
            ))}
          </div>
        </section>

        {/* Strengths */}
        <AnalysisSection
          items={analysis?.strengths || []}
          title="Strength"
          icon={<BicepsFlexed className="h-4 w-4"/>}
          variant="success"
        />

        {/* Weaknesses */}
        <AnalysisSection
          items={analysis?.weaknesses || []} 
          title="Weakness"
          icon={<AlertTriangle className="h-4 w-4"/>}
          variant="warning"
        />

        {/* Suggestions */}
        <div className="lg:col-span-2">
          <AnalysisSection
            items={analysis?.improvementSuggestions || []}
            title="Suggestions"
            icon={<WandSparkles className="h-4 w-4"/>}
            variant="info"
          />
        </div>
      </div>
    </div>
  );
}