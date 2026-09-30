import { ObjectId } from "mongodb";

export interface StandaloneResumeAnalysis {
  resumeQualityScore: number;
  formattingAndStructureRating: string;
  strongPoints: string[];
  weakPoints: string[];
  recommendedKeywordsToInclude: string[];
  actionableImprovements: string[];
  skills: string[];
  summary: string;
}

export interface TargetedResumeAnalysis {
  jobTitle: string;
  company: string;
  jobDescription: string;
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  missingKeywords: string[];
  improvementSuggestions: string[];
  summary: string;
}

export interface UnifiedResumeAnalysis {
  analysisType: "standalone" | "targeted";
  resumeTitle: string;    // TODO: later change into meaning or unique pdf name
  jobTitle?: string;    // Only present if targeted
  company?: string;     // Only present if targeted
  jobDescription?: string;      // Only present if targeted
  overallScore: number;
  atsScore?: number;          // Only present if targeted
  jobMatchScore?: number;     // Only present if targeted
  formattingAndStructureRating?: string; // Only present if standalone
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  missingKeywords: string[];       // Unified: missingKeywords or recommendedKeywords
  improvementSuggestions: string[];
  summary: string;
}

export interface StoredResumeAnalysis extends UnifiedResumeAnalysis {
  _id?: ObjectId;
  userId: ObjectId;
  resumeId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArgumentType {
  analysisType: "targeted" | "standalone",
  resumeText:string,
  resumeTitle:string,
  resumeId: string,
  jobTitle:string,
  jobDescription:string,
  company:string,
}
