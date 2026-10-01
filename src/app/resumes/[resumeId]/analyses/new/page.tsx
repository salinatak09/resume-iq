"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { analyzeAndSaveResume } from "@/actions/analysis-actions";

export default function NewAnalysisForm() {
  const { resumeId } = useParams<{resumeId: string}>();
  const [analysisType, setAnalysisType] = useState<"standalone" | "targeted">("targeted");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    // Call your backend action or stream handler here
    const { success, analysisId, error } = await analyzeAndSaveResume({
      resumeId,
      analysisType,
      jobTitle,
      jobDescription,
      company
    });

    if(success){
      alert("Resume anlysis done. Redirecting to analysis page...");
      setLoading(false);
      router.push(`/resumes/${resumeId}/analyses/${analysisId}`);
    } else {
      alert(error);
      setLoading(false);
    }
    
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 max-w-2xl mx-auto my-8">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Generate New Analysis</h3>
        <p className="text-sm text-slate-500 mt-1">Choose how you want to evaluate this specific resume.</p>
      </div>

      {/* Toggle Type */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setAnalysisType("targeted")}
          className={`p-4 rounded-xl border text-left transition-all ${
            analysisType === "targeted" 
              ? "border-teal-600 bg-teal-50/50 text-teal-900 font-medium" 
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <div className="font-semibold">Target Job Description</div>
          <div className="text-xs text-slate-500 mt-1">Benchmark resume against a specific role</div>
        </button>

        <button
          type="button"
          onClick={() => setAnalysisType("standalone")}
          className={`p-4 rounded-xl border text-left transition-all ${
            analysisType === "standalone" 
              ? "border-teal-600 bg-teal-50/50 text-teal-900 font-medium" 
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <div className="font-semibold">Standalone Review</div>
          <div className="text-xs text-slate-500 mt-1">General formatting, strengths, and weaknesses</div>
        </button>
      </div>

      {analysisType === "targeted" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Company Name</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company Name"
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800"
            required={analysisType === "targeted"}
          />

          <label className="block text-sm font-medium text-slate-700">Job Title</label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Job Tite (eg. Software Engineer)"
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800"
            required={analysisType === "targeted"}
          />

          <label className="block text-sm font-medium text-slate-700">Job Description</label>
          <textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste role requirements, responsibilities, and tech stack here..."
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-slate-800"
            required={analysisType === "targeted"}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing resume contents..." : "Run Analysis"}
      </button>
    </form>
  );
}