"use server";

import { getResumeByUserId } from "@/actions/resume-actions";
import ResumeCard from "@/components/ResumeCard";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ResumesPage() {
  // Fetch all resumes for the authenticated user from MongoDB
  const {success, resumes, error} = await getResumeByUserId();

  if(!success){
    // alert(error);
    console.log(error);
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Top Bar with Title & Upload CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Resumes</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage all your uploaded master copies and their associated analyses.</p>
        </div>
        <Link
          href="/upload" 
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-1"
        >
          <Plus className="h-4 w-4 stroke-3"/> Upload New Resume
        </Link>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Example Resume Card Item */}
        { (!success) ? (
          <div className="rounded-xl col-span-full border border-dashed bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">
              No uploaded resumes yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Upload your resume to get started.
            </p>

            <Link
              href="/upload"
              className="mt-5 inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm text-white font-semibold hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 stroke-3 inline"/>
              Upload Resume
            </Link>
          </div>       
        ) :
        resumes?.map((resume)=>{
          return(
            <ResumeCard 
              key={resume.id} 
              id={resume.id} 
              filename={resume.title} 
              createdAt={resume.createdAt} 
              analysisCount={resume.analysisCount || 0} 
            />
          )
        })}
      </div>
    </div>
  );
}