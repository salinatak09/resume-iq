"use client";

import { removeResumeAnalysisById } from "@/actions/analysis-actions";
import { getAnalysisTimeLabel, getScoreColor } from "@/lib/utils"
import { Trash } from "lucide-react";
import Link from "next/link";

interface AnalysisCardProps{
  id:string,
  overallScore: number,
  analysisType: "standalone" | "targeted",
  jobTitle?: string,
  company?: string,
  resumeId: string,
  createdAt: Date
}

const scoreClasses = {
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600'
}

const AnalysisCard = (analysis:AnalysisCardProps) => {
  const {id, resumeId, overallScore, analysisType, jobTitle, company, createdAt} = analysis;
  
  const isTargeted = analysisType === "targeted";

  const handleDelete = async () => {
    const isDelete = confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!isDelete) return;

    const { success, error, message } = await removeResumeAnalysisById(id, resumeId);

    if (success) {
      alert(message);
      // refresh/update UI here
    } else {
      alert(error);
    }
  };
  

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-teal-300 transition-all" key={id}>
      <div className="flex justify-between items-start">
      <div>
        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
        {isTargeted ? 'Targeted Job Match' : 'Standalone Analysis'}
        </span>
        <h4 className="font-semibold text-slate-800 mt-2">
          {isTargeted ? `${jobTitle} at ${company}` : "Resume Insights"}</h4>
      </div>
      <span className={`text-lg font-bold ${scoreClasses[getScoreColor(overallScore)]} px-3 py-1 rounded-lg`}>
        {overallScore}%
      </span>
      </div>
      <p className="text-xs text-slate-400 mt-3">Analyzed {getAnalysisTimeLabel(createdAt)}</p>
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <button className="hover:bg-red-50 text-red-500 p-2 rounded-lg cursor-pointer" onClick={handleDelete}>
          <Trash className="h-4 w-4"/>
        </button>
        <Link
          href={`/resumes/${resumeId}/analyses/${id}`}
          className="text-sm font-medium text-teal-600 hover:underline"
        >
          View Full Report →
        </Link>
      </div>
    </div>
  )
}

export default AnalysisCard