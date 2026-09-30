"use server";

import { ApiError, NotFoundError } from "@/lib/errors";
import { extractPdfText } from "@/lib/pdf";
import { requireSession } from "@/server/auth";
import { createResume, decrementResumeAnalysisCountById, deleteResumeById, deleteResumesByUserId, fetchResumeById, fetchResumeCountByUserId, fetchResumesByUserId, incrementResumeAnalysisCountById } from "@/server/dbqueries/resume";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { removeAllResumeAnalysisByUserId, removeResumeAnalysisByResumeId } from "./analysis-actions";

export const uploadResume = async(formData: FormData) => {
  try {

    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Read Upload
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ApiError("PDF file is required.");
    }

    // Validate File type & File size
    if (file.type !== "application/pdf") {
      throw new ApiError("Only PDF files are allowed.");
    }

    // convert pdf content into Uint8Array (acceptable for PDFParser)
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const pdfHeader = new TextDecoder().decode(bytes.slice(0, 5));

    // Validate pdf header
    if (bytes.length < 5 || pdfHeader !== "%PDF-") {
      throw new ApiError("Invalid PDF file.");
    }

    // 5 MB limit for now
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError("File size must be less than 5MB.");
    }

    // Generate Resume Id
    const resumeId = new ObjectId();

    // TODO: Save pdf in cloud storage

    // Extract text
    const extractedText = await extractPdfText(bytes);
    const normalizedText = extractedText.replace(/\s+/g, " ").trim();

    if (!normalizedText) {
      throw new ApiError("Could not extract text from this PDF.");
    }

    if (normalizedText.length < 100) {
      throw new ApiError("Could not extract enough text from this PDF.");
    }

    // Create & Insert Resume data in MongoDB 
    const now = new Date();

    const resume = {
      _id: resumeId,
      title: file.name.replace(/\.pdf$/i, "").trim().slice(0, 200),
      fileSize: file.size,
      extractedText,
      status: "UPLOADED" as const,
      analysisCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const id = await createResume(resume, userId);

    //  Revalidate cache so UI updates immediately
    revalidatePath("/dashboard");

    return (
      {
        success: true,
        resume: {
          id,
          title: resume.title,
          status: resume.status,
        },
      }
    );
  } catch (error) {

    if (error instanceof ApiError) {
      return(
        {
          success: false,
          error: error.message,
        }
      );
    }

    console.error("Resume upload failed:", error);

    return (
      {
        success: false,
        error: "Failed to upload resume.",
      }
    );
  }

}

export const getResumeTextById = async (resumeId: string) => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check if resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    const resume = await fetchResumeById(resumeId, userId);

    if(!resume){
      throw new NotFoundError("Could not found resume.");
    }

    return (
      {
        success: true,
        resumeText: resume?.extractedText,
        resumeTitle: resume?.title
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

    console.error("Resume fetch failed:", error);

    return (
      {
        success: false,
        error: "Failed to fetch resume.",
      }
    );
  }
}

export const getResumeById = async (resumeId: string) => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check if resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    const resume = await fetchResumeById(resumeId, userId);

    if(!resume){
      throw new NotFoundError("Could not found resume.");
    }

    return (
      {
        success: true,
        resume,
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

    console.error("Resume fetch failed:", error);

    return (
      {
        success: false,
        error: "Failed to fetch resume.",
      }
    );
  }
}

export const getResumeByUserId = async () => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    const resumes = await fetchResumesByUserId(userId);

    if(!resumes.length){
      throw new NotFoundError("Could not found resume.");
    }

    return (
      {
        success: true,
        resumes: resumes.map((resume)=>({
          id: resume._id.toString(),
          title: resume.title,
          fileSize: resume.fileSize,
          analysisCount: resume.analysisCount,
          createdAt: resume.createdAt
        }))
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

    console.error("Resume fetch failed:", error);

    return (
      {
        success: false,
        error: "Failed to fetch resume.",
      }
    );
  }
}

export const incrementResumeAnalysisCount = async (resumeId: string)=>{
  try {
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check if resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    const result = await incrementResumeAnalysisCountById(resumeId, userId);

    if (result.matchedCount === 0) {
      throw new NotFoundError("Could not find resume.");
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.error("Resume analysis count update failed:", error);

    return {
      success: false,
      error: "Failed to update resume analysis count.",
    };
  }
}

export const decrementResumeAnalysisCount = async (resumeId: string) => {
  try {
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check if resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    const result = await decrementResumeAnalysisCountById(resumeId, userId);

    if (result.matchedCount === 0) {
      throw new NotFoundError("Could not find resume.");
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.error("Resume analysis count update failed:", error);

    return {
      success: false,
      error: "Failed to update resume analysis count.",
    };
  }
};

export const countResumeByUserId = async () =>{
    try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    const count = await fetchResumeCountByUserId(userId);

    return (
      {
        success: true,
        resumeCount: count,
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

    console.error("Resume count failed:", error);

    return (
      {
        success: false,
        error: "Failed to count resume.",
      }
    );
  }
}

export const removeAllResumeByUserId = async () => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Remove all analysis associated with resume => first remove all analysis for current user
    const {success} = await removeAllResumeAnalysisByUserId();
    
    if(!success){
      throw new ApiError("Could not delete resume.");
    }

    // Remove all resumes of current user
    const result = await deleteResumesByUserId(userId);

    if(!result.acknowledged){
      throw new ApiError("Could not delete resume.");
    }

    return (
      {
        success: true,
        message: "All resumes deleted successfully.",
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

    console.error("Failed to delete resumes:", error);

    return (
      {
        success: false,
        error: "Failed to delete resumes.",
      }
    );
  }
}

export const removeResumeById = async (resumeId: string) => {
  try{
    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Check id resumeId is valid
    if (!ObjectId.isValid(resumeId)) {
      throw new ApiError("Invalid resume ID.");
    }

    // Remove analysis associated with resume
    const {success} = await removeResumeAnalysisByResumeId(resumeId);

    if(!success){
      throw new ApiError("Could not delete resume.");
    }

    // Remove all resumes of current user
    const result = await deleteResumeById(resumeId, userId);

    if(!result.acknowledged){
      throw new ApiError("Could not delete resume.");
    }
    
    // Resume not found or doesn't belong to user
    if (result.deletedCount === 0) {
      throw new NotFoundError("Resume not found.");
    }
    
    // Tell Next.js to refresh cached data
    revalidatePath('/resumes');

    return (
      {
        success: true,
        message: "Resume deleted successfully.",
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

    console.error("Failed to delete resume:", error);

    return (
      {
        success: false,
        error: "Failed to delete resume.",
      }
    );
  }
}
