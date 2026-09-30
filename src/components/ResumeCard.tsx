"use client";

import { removeResumeById } from "@/actions/resume-actions";
import { getAnalysisTimeLabel } from "@/lib/utils";
import { Eye, Trash } from "lucide-react";
import Link from "next/link";

interface ResumeCardProps {
  id: string;
  filename: string;
  createdAt: string | Date;
  analysisCount: number;
}

export default function ResumeCard(resume: ResumeCardProps) {
  const { id, filename, createdAt, analysisCount } = resume;

  const handleDelete = async () => {
    const isDelete = confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!isDelete) return;

    const { success, error, message } = await removeResumeById(id);

    if (success) {
      alert(message);
      // refresh/update UI here
    } else {
      alert(error);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          {/* TODO: add resume view button which open pdf */}
          {/* show file size of pdf */}
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
            CV
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            {analysisCount} {analysisCount <= 1 ? "Analysis" : "Analyses"}
          </span>
        </div>
        <h4 className="font-semibold text-slate-800 mt-4 truncate" title={filename}>
          {filename}
        </h4>
        <p className="text-xs text-slate-400 mt-1">Uploaded on {getAnalysisTimeLabel(createdAt)}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            className="text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 flex items-center gap-1 py-1 px-3 rounded-lg"
          >
            {/* TODO: Add view PDF functionality */}
            <div className="hidden sm:block">View PDF</div> <Eye className="h-5 w-5"/>
          </button>
          <button className="flex gap-1 rounded-lg cursor-pointer py-1 px-3 text-red-600 hover:bg-red-50" onClick={handleDelete}>
            <div className="hidden sm:block">Delete</div>
            <Trash className="h-5 w-5"/>
          </button>
        </div>
        <Link
          href={`/resumes/${id}`}
          className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          View Analyses →
        </Link>
      </div>
    </div>
  );
}