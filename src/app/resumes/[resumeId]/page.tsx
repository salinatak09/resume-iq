"use server";

import { getResumeAnalysisByResumeId, removeResumeAnalysisById } from "@/actions/analysis-actions";
import { getResumeById } from "@/actions/resume-actions";
import AnalysisCard from "@/components/AnalysisCard";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ resumeId: string }>;
}

export default async function ResumeDetailPage({ params }: PageProps) {
  const { resumeId } = await params;
  
  // Fetch data using your read APIs / database functions
  const {success, analysis, error} = await getResumeAnalysisByResumeId(resumeId);
  const {resume} = await getResumeById(resumeId);

  if(!success){
    console.log(error);
    // alert(error);
  }

  return (
    <div className="space-y-6">
      {/* Navigation breadcrumb */}
      <Link
        href={`/resumes`}
        className="font-medium text-slate-500 hover:text-teal-600 transition-colors"
      >
        ← Back to Resumes
      </Link>

      {/* Top Header info */}
      <div className="bg-white p-6 mt-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-1 rounded">
            Resume Workspace
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-1">{resume?.title}.pdf</h2>
          <p className="text-sm text-slate-500">Manage standalone reports and job description matches.</p>
        </div>
        <Link
          href={`/resumes/${resumeId}/analyses/new`}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors flex gap-1 items-center"
        >
          <Plus className="h-4 w-4 stroke-3"/>
          New Analysis
        </Link>
      </div>

      {/* List of Multiple Analyses for this Resume */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Analysis History</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!success ? (
            <div className="rounded-xl col-span-full border border-dashed bg-white p-10 text-center">
              <h2 className="text-lg font-semibold">
                No analysis found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Analyze your resume to get insights.
              </p>

              <Link
                href={`/resumes/${resumeId}/analyses/new`}
                className="mt-5 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm text-white font-semibold hover:bg-teal-700"
              >
                <Sparkles className="h-4 w-4 inline mr-1"/>
                Analyze Resume
              </Link>
            </div> 
          ) : analysis?.map((item)=>
            <AnalysisCard
              key={item.id}
              id={item.id}
              resumeId={resumeId}
              analysisType={item.analysisType}
              overallScore={item.overallScore}
              jobTitle={item.jobTitle}
              company={item.company}
              createdAt={item.createdAt}
            />
          )}
        </div>
      </div>
    </div>
  );
}