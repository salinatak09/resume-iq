import { ArgumentType, UnifiedResumeAnalysis } from '@/types/analysis';
import { GenerateContentResponse, GoogleGenAI, Type } from '@google/genai';

// Initialize the client. It automatically picks up the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI();

/**
 * Analyzes extracted resume text against a job description.
 * @param {string} resumeText - The raw text extracted from the resume.
 * @param {string} jobDescription - The target job description.
 * @returns {Promise<object>} The structured JSON analysis.
 */

export async function generateAIAnalysis({
  analysisType,
  resumeText,
  resumeTitle,
  jobTitle = "",
  jobDescription = "",
  company = "",
}: Omit<ArgumentType, "resumeId">) : Promise<UnifiedResumeAnalysis> {

  let prompt = ``;
  let responseSchema: Record<string, any> = {};
  const isTargeted = analysisType === "targeted";

  if(!isTargeted){
    prompt = `
      You are an elite career coach and resume reviewer. The user did not provide a specific job description. 
      Conduct a comprehensive, standalone review of the resume text. 
      Evaluate overall formatting clarity, grammatical quality, impact of impact/action verbs, and how well their skills are highlighted.
      
      RESUME TEXT: ${resumeText}
    `;

    responseSchema = {
      type: Type.OBJECT,
      properties: {
        resumeQualityScore: {
          type: Type.INTEGER,
          description: 'Overall professional score out of 100.' 
        },
        formattingAndStructureRating: { 
          type: Type.STRING, 
          description: 'Feedback on layout, flow, and structural choices.' 
        },
        strongPoints: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: 'What the candidate did exceptionally well.' 
        },
        weakPoints: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: 'Grammar issues, passive language, or weak descriptions.' 
        },
        recommendedKeywordsToInclude: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: 'Industry-standard keywords they should add based on their implied field.' 
        },
        actionableImprovements: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: 'Step-by-step changes to make the resume pop.' 
        },
        skills: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'A list of important technical, professional, domain-specific, and transferable skills explicitly demonstrated or mentioned in the resume.'
        },
        summary:{
          type: Type.STRING,
          description: 'A short summary of resume.'
        }
      },
      required: ['resumeQualityScore', 'formattingAndStructureRating', 'skills', 'strongPoints', 'weakPoints', 'actionableImprovements', 'summary', 'recommendedKeywordsToInclude'],
    }
  } else {
    prompt = `
      You are an expert ATS (Applicant Tracking System) and HR recruiter. 
      Analyze the following resume text against the provided job description.
    
      RESUME TEXT:
      ${resumeText}
    
      JOB DESCRIPTION:
      ${jobDescription}

      Evaluate the candidate thoroughly and provide your output matching the required JSON structure.

      Scoring Rules:
      - overallScore, atsScore, and jobMatchScore must be integers between 0 and 100.
      - skills: Extract important technical and professional skills found in the job description/resume.
      - missingKeywords: Identify important keywords or tools from the job description that are missing in the resume.
      - strengths: Identify actual strengths in the candidate's background.
      - weaknesses: Identify concrete issues or gaps.
      - improvementSuggestions: Provide actionable steps to rewrite or improve the resume.
      - summary: Write a short executive summary of the resume.
    `;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        overallScore: {
          type: Type.INTEGER, 
          description: 'A percentage resume score out of 100.' 
        },
        atsScore: {
          type: Type.INTEGER, 
          description: 'A percentage ATS score out of 100.' 
        },
        jobMatchScore: {
          type: Type.INTEGER, 
          description: 'A percentage job match score out of 100.' 
        },
        strengths: {
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'Key qualifications the candidate possesses.'
        },
        weaknesses: {
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'Areas where the candidate falls short.'
        },
        skills: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'A list of important technical, professional, domain-specific, and transferable skills explicitly demonstrated or mentioned in the resume. Do not include skills that are only mentioned in the job description and are absent from the resume.'
        },
        missingKeywords: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'Important keywords or tools from the job description missing in the resume.'
        },
        improvementSuggestions: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'Actionable steps to rewrite or improve the resume.'
        },
        summary:{
          type: Type.STRING,
          description: 'A short summary of resume.'
        }
      },
      required: ['overallScore', 'atsScore', 'jobMatchScore', 'skills', 'strengths', 'weaknesses', 'missingKeywords', 'improvementSuggestions', 'summary'],
    }
  }

  try {

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        // Enforce a strict JSON output structure
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2, // Keeps the output reliable and consistent
      },
    });

    // Parse the strict JSON string directly into a JavaScript object
    const rawResult = JSON.parse(response?.text || '{}');

    // Normalize the result into the UnifiedResumeAnalysis structure
    const normalizedResult: UnifiedResumeAnalysis = isTargeted
      ? {
          analysisType: "targeted",
          resumeTitle,
          overallScore: rawResult.overallScore,
          atsScore: rawResult.atsScore,
          jobMatchScore: rawResult.jobMatchScore,
          jobTitle,
          jobDescription,
          company,
          strengths: rawResult.strengths,
          weaknesses: rawResult.weaknesses,
          skills: rawResult.skills,
          missingKeywords: rawResult.missingKeywords, // Mapped to general keywords field
          improvementSuggestions: rawResult.improvementSuggestions,
          summary: rawResult.summary,
        }
      : {
          analysisType: "standalone",
          resumeTitle,
          overallScore: rawResult.resumeQualityScore, // Mapped to overallScore
          formattingAndStructureRating: rawResult.formattingAndStructureRating,
          strengths: rawResult.strongPoints,        // Mapped to strengths
          weaknesses: rawResult.weakPoints,        // Mapped to weaknesses
          skills: rawResult.skills,
          missingKeywords: rawResult.recommendedKeywordsToInclude, // Mapped to general keywords field
          improvementSuggestions: rawResult.actionableImprovements, // Mapped
          summary: rawResult.summary,
        };
    return normalizedResult;

  } catch (error) {
    console.error('Error during resume analysis:', error);
    throw error;
  }
}


// TODO: add retry attempts
async function generateWithRetry(prompt: string, responseSchema: Record<string, any>, retries = 3): Promise<GenerateContentResponse | undefined> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt + 1}/${retries + 1}`);
      return await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          // Enforce a strict JSON output structure
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.2, // Keeps the output reliable and consistent
        },
      });
    } catch (error: any) {
      const status = error?.status ?? error?.code;

      if (status !== 503 || attempt === retries) {
        throw error;
      }

      const delay = 1000 * 2 ** attempt + Math.random() * 500;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
