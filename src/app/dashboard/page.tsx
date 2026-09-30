import Link from "next/link";
import { getCurrentSession } from "@/server/auth";
import { countResumeByUserId } from "@/actions/resume-actions";
import { countResumeAnalysisByUserId, getResumeAnalysisByUserId } from "@/actions/analysis-actions";
import { getScoreColor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await getCurrentSession();
  const {success, resumeCount, error} = await countResumeByUserId();
  const {analysisCount} = await countResumeAnalysisByUserId();
  const { analysis } = await getResumeAnalysisByUserId();

  const avgScore = (analysis && analysisCount) ?  
    Number((analysis.reduce((acc, a)=>acc+a.overallScore, 0) / analysisCount).toFixed(2)) : 0;

  if(!success){
    // alert(error);
    console.log(error);
  }

  const scoreClasses = {
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-roemberse-50 border-ember-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100'
  }

  return (
    <div className="space-y-8 mt-8 max-w-6xl mx-auto">
      {/* Welcome Greeting */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
            Overview
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">Hello, {session?.user.name}! 👋</h2>
          <p className="text-sm text-slate-500 mt-0.5">Here is a quick overview of your resume analysis activities.</p>
        </div>
        <Link
          href="/resumes"
          className="text-sm font-medium hover:text-teal-700 bg-teal-50 hover:bg-teal-100/60 px-4 py-2 rounded-lg transition-colors"
        >
          View All Resumes →
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Resumes</div>
          <div className="text-3xl font-black text-slate-800 mt-2">{resumeCount}</div>
          <div className="text-xs font-medium mt-1">Active master copies</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Analyses Run</div>
          <div className="text-3xl font-black text-slate-800 mt-2">{analysisCount}</div>
          <div className="text-xs font-medium mt-1">Standalone & Job matches</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg. Overall Score</div>
          <div className="text-3xl font-black mt-2 text-slate-800">{avgScore}%</div>
          <div className="text-xs font-medium mt-1">Across all job targets & standalone</div>
        </div>
      </div>

      {/* Main Grid: Upload Dropzone + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Right Column: Recent Analyses Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Recent Analyses</h3>

          { (!analysis || !analysis.length) ? (
            <div className="rounded-xl border border-dashed bg-white p-10 text-center">
              <h2 className="text-lg font-semibold">
                No analysed resumes yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Analyse your first resume to get started.
              </p>

              <Link
                href="/resumes"
                className="mt-5 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm text-white font-semibold hover:bg-teal-700"
              >
                Analyze Resume
              </Link>
            </div>
          ): (
            <div className="space-y-3">
              { analysis.slice(0,6)?.map((item)=>(
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-teal-300 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {item.analysisType === "targeted" ? "Job Match" : "Standalone"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {/* TODO: add pdf name here & link to open pdf */}
                        { item.resumeTitle || "Resume"}.pdf
                      </span>
                    </div>
                    {item.analysisType === "targeted" && <h4 className="font-semibold text-slate-800 text-sm">{item.jobTitle} at {item.company}</h4>}
                  </div>
                  <div className="flex items-center sm:gap-4">
                    <div className="text-right">
                      <span className={`sm:text-lg font-bold p-1 border rounded-md ${scoreClasses[getScoreColor(item.overallScore)]}`}>
                        {item.overallScore}%
                      </span>
                    </div>
                    {/* We can ad this link to whole row */}
                    <Link
                      href={`/resumes/${item.resumeId}/analyses/${item.id}`}
                      className="text-gray-400 hover:text-teal-600 transition-colors"
                      title="View detailed feedback"
                    >
                      <ChevronRight/>
                    </Link>
                  </div>
                </div>
              )) }
            </div>
          )}

        </div>
      </div>
    </div>
  );
}