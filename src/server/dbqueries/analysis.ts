import "server-only";

import { getDB } from "@/lib/db";
import { StoredResumeAnalysis, UnifiedResumeAnalysis } from "@/types/analysis";
import { DeleteResult, ObjectId } from "mongodb";

export async function createAnalysis(
  analysisData: UnifiedResumeAnalysis,
  userId: string,
  resumeId: string,
): Promise<string> {
  const db = await getDB();

  const documentToInsert: StoredResumeAnalysis = {
    ...analysisData,
    userId: new ObjectId(userId),
    resumeId: new ObjectId(resumeId),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection<StoredResumeAnalysis>("analysis").insertOne(documentToInsert);

  return result.insertedId.toString();
}

export async function fetchAnalysisByUserId(
  userId:string
){
  const db = await getDB();
  
  const analysis = await db.collection<StoredResumeAnalysis>("analysis").find({
    userId: new ObjectId(userId)
  }, {
    projection: {
      _id: 1,
      overallScore: 1,
      analysisType: 1,
      resumeTitle: 1,
      jobTitle:1,
      resumeId:1,
      company: 1,
      createdAt: 1,
    },
  })
  .sort({ createdAt: -1 })
  .toArray();

  return analysis;
}

export async function fetchAnalysisByResumeId(
  userId:string,
  resumeId: string,
){
  const db = await getDB();
  
  const analysis = await db.collection<StoredResumeAnalysis>("analysis").find({
    userId: new ObjectId(userId),
    resumeId: new ObjectId(resumeId),
  }, {
    projection: {
      _id: 1,
      overallScore: 1,
      analysisType: 1,
      jobTitle:1,
      company: 1,      
      createdAt: 1,
    },
  })
  .sort({ createdAt: -1 })
  .toArray();

  return analysis;
}

export async function fetchAnalysisById(
  id: string,
  userId:string,
  resumeId: string,
):Promise<StoredResumeAnalysis | null>{
  const db = await getDB();
  
  const analysis = await db.collection<StoredResumeAnalysis>("analysis").findOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
    resumeId: new ObjectId(resumeId),
  });

  return analysis;
}

export async function fetchAnalysisCountByUserId(
  userId:string
){
  const db = await getDB();
  
  const count = await db.collection<StoredResumeAnalysis>("analysis").countDocuments({
    userId: new ObjectId(userId)
  });

  return count;
}

export async function fetchAnalysisCountByResumeId(
  userId:string,
  resumeId: string,
){
  const db = await getDB();
  
  const count = await db.collection<StoredResumeAnalysis>("analysis").countDocuments({
    userId: new ObjectId(userId),
    resumeId: new ObjectId(resumeId)
  });

  return count;
}

export async function deleteAnalysisByUserId(
  userId:string
): Promise<DeleteResult>{
  const db = await getDB();

  const result = await db.collection<StoredResumeAnalysis>("analysis").deleteMany({
    userId: new ObjectId(userId)
  });

  return result;
}

export async function deleteAnalysisByResumeId(
  userId: string,
  resumeId: string,
): Promise<DeleteResult>{
  const db = await getDB();

  const result = await db.collection<StoredResumeAnalysis>("analysis").deleteMany({
    userId: new ObjectId(userId),
    resumeId: new ObjectId(resumeId),
  });

  return result;
}

export async function deleteAnalysisById(
  id: string,
  userId: string,
  resumeId: string,
): Promise<DeleteResult>{
  const db = await getDB();

  const result = await db.collection<StoredResumeAnalysis>("analysis").deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
    resumeId: new ObjectId(resumeId),
  });

  return result;
}
