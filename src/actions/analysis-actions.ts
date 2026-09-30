"use server";

import { generateAIAnalysis } from "@/lib/analyze";
import { ApiError, NotFoundError } from "@/lib/errors";
import { requireSession } from "@/server/auth";
import { createAnalysis, deleteAnalysisById, deleteAnalysisByResumeId, deleteAnalysisByUserId, fetchAnalysisById, fetchAnalysisByResumeId, fetchAnalysisByUserId, fetchAnalysisCountByResumeId, fetchAnalysisCountByUserId } from "@/server/dbqueries/analysis";
import { decrementResumeAnalysisCount, getResumeTextById, incrementResumeAnalysisCount } from "./resume-actions";
import { ObjectId } from "mongodb";
import { ArgumentType } from "@/types/analysis";
import { revalidatePath } from "next/cache";


export const analyzeAndSaveResume = async({
  resumeId,
  analysisType,
  ...jobData
}: Omit<ArgumentType, "resumeText" | "resumeTitle">) => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check if resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    // Collect data to analyse
    const { resumeText, resumeTitle, success, error } = await getResumeTextById(resumeId);

    if(!success || !resumeText){
      throw new ApiError(error || "Unknown error occurred.");
    }

    const resumeData = {
      analysisType,
      resumeText,
      resumeTitle,
      ...jobData,
    }

    // Analyse resume
    const analysis = await generateAIAnalysis(resumeData);

    // Store in DB
    const id = await createAnalysis(analysis, userId, resumeId);

    // Increase count after successful analysis
    await incrementResumeAnalysisCount(resumeId);

    return (
      {
        success: true,
        analysisId:id
      }
    )

  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Resume analysis failed:", error);

    return (
      {
        success: false,
        error: "Failed to analyze resume.",
      }
    );
  }
}

export const getResumeAnalysisById = async(
  analysisId: string,
  resumeId: string,
)=>{
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check if analysisId is valid
    if (!ObjectId.isValid(analysisId)) {
      throw new ApiError("Invalid analysis ID.");
    }

    // Check if resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    // fetch resume analysis 
    const analysis = await fetchAnalysisById(analysisId, userId, resumeId);

    if(!analysis){
      throw new NotFoundError("Could not found analysis.");
    }

    return ({
      success: true,
      analysis
    })

  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Failed to fetch resume analysis:", error);

    return (
      {
        success: false,
        error: "Failed to fetch resume analysis.",
      }
    );
  }
}

export const getResumeAnalysisByUserId = async()=>{
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // fetch resume analysis 
    const analysis = await fetchAnalysisByUserId(userId);

    if(!analysis.length){
      throw new NotFoundError("Could not found analysis.");
    }

    return ({
      success: true,
      analysis: analysis.map(a=>({
        id: a._id.toString(),
        resumeId: a.resumeId.toString(),
        resumeTitle: a.resumeTitle,
        overallScore: a.overallScore || 0,
        analysisType: a.analysisType,
        jobTitle: a.jobTitle || '',
        company: a.company || '',
        createdAt: a.createdAt,
      }))
    })

  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Failed to fetch resume analysis:", error);

    return (
      {
        success: false,
        error: "Failed to fetch resume analysis.",
      }
    );
  }
}

export const getResumeAnalysisByResumeId = async(
  resumeId: string,
)=>{
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // fetch resume analysis 
    const analysis = await fetchAnalysisByResumeId(userId, resumeId);

    if(!analysis.length){
      throw new NotFoundError("Could not found analysis.");
    }

    return ({
      success: true,
      analysis: analysis.map(a=>({
        id: a._id.toString(),
        overallScore: a.overallScore || 0,
        analysisType: a.analysisType,
        jobTitle: a.jobTitle || '',
        company: a.company || '',
        createdAt: a.createdAt,
      }))
    })

  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Failed to fetch resume analysis:", error);

    return (
      {
        success: false,
        error: "Failed to fetch resume analysis.",
      }
    );
  }
}

export const countResumeAnalysisByUserId = async()=>{
    try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // fetch resume analysis 
    const analysisCount = await fetchAnalysisCountByUserId(userId);

    return ({
      success: true,
      analysisCount
    })

  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Failed to count resume analysis:", error);

    return (
      {
        success: false,
        error: "Failed to count resume analysis.",
      }
    );
  }
}

export const countResumeAnalysisByResumeId = async(
  resumeId: string
)=>{
    try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // fetch resume analysis 
    const analysisCount = await fetchAnalysisCountByResumeId(userId, resumeId);

    return ({
      success: true,
      analysisCount
    })

  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Failed to count resume analysis:", error);

    return (
      {
        success: false,
        error: "Failed to count resume analysis.",
      }
    );
  }
}

export const removeAllResumeAnalysisByUserId = async () => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Remove all resume analysis of current user
    const result = await deleteAnalysisByUserId(userId);

    if(!result.acknowledged){
      throw new ApiError("Could not delete resume analysis.");
    }

    return (
      {
        success: true,
        message: "All resume analysis deleted successfully.",
        deleteCount: result.deletedCount
      }
    )
  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Failed to delete resume analysis:", error);

    return (
      {
        success: false,
        error: "Failed to delete resume analysis.",
      }
    );
  }
}

export const removeResumeAnalysisByResumeId = async (
  resumeId: string,
) => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check if resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    // Remove all resume analysis associated with resumeId of current user
    const result = await deleteAnalysisByResumeId(userId, resumeId);

    if(!result.acknowledged){
      throw new ApiError("Could not delete resume analysis.");
    }

    return (
      {
        success: true,
        message: "Resume analysis deleted successfully.",
        deleteCount: result.deletedCount
      }
    )
  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Failed to delete resume analysis:", error);

    return (
      {
        success: false,
        error: "Failed to delete resume analysis.",
      }
    );
  }
}

export const removeResumeAnalysisById = async (
  analysisId: string,
  resumeId: string,
) => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check if analysisId is valid
    if (!ObjectId.isValid(analysisId)) {
      throw new ApiError("Invalid analysis ID.");
    }

    // Check if resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    // Remove resume analysis
    const result = await deleteAnalysisById(analysisId, userId, resumeId);

    // Decrease count after successful deletion
    await decrementResumeAnalysisCount(resumeId);

    // Tell Next.js to refresh cached data
    revalidatePath(`/resumes/${resumeId}`);

    if(!result.acknowledged){
      throw new ApiError("Could not delete resume analysis.");
    }

    // Resume not found or doesn't belong to user
    if (result.deletedCount === 0) {
      throw new NotFoundError("Resume not found.");
    }

    return (
      {
        success: true,
        message: "Resume analysis deleted successfully.",
      }
    )
  }catch(error){
    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Failed to delete resume analysis:", error);

    return (
      {
        success: false,
        error: "Failed to delete resume analysis.",
      }
    );
  }
}