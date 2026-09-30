import "server-only";

import { Resume } from "@/types/resume";
import { getDB } from "../../lib/db";
import { DeleteResult, ObjectId, UpdateResult } from "mongodb";

export async function createResume(
  resumeData: Omit<Resume, "userId">,
  currentUserId: string
):Promise<string> {
  const db = await getDB();

  const fullResume: Resume = {
    ...resumeData,
    userId: new ObjectId(currentUserId),
  };

  const result = await db.collection<Resume>("resumes").insertOne(fullResume);

  return result.insertedId.toString();
}

export async function fetchResumesByUserId(
  userId:string
){
  const db = await getDB();
  
  const resumes = await db.collection<Resume>("resumes").find({
    userId: new ObjectId(userId)
  }, {
    projection: {
      _id: 1,
      title: 1,
      fileSize: 1,
      analysisCount: 1,
      createdAt: 1,
    },
  })
  .sort({ createdAt: -1 })
  .toArray();
  
  return resumes;
} 

export async function fetchResumeById(
  resumeId: string,
  userId:string
):Promise<Resume | null>{
  const db = await getDB();
  
  const resume = await db.collection<Resume>("resumes").findOne({
    _id: new ObjectId(resumeId),
    userId: new ObjectId(userId)
  });

  return resume;
}

export async function incrementResumeAnalysisCountById(
  resumeId: string,
  userId:string,
):Promise<UpdateResult>{
  const db = await getDB();
  
  const resume = await db.collection<Resume>("resumes").updateOne({
    _id: new ObjectId(resumeId),
    userId: new ObjectId(userId)
  }, {
    $inc:{
      analysisCount: 1
    }
  });

  return resume;
}

export async function decrementResumeAnalysisCountById(
  resumeId: string,
  userId:string,
):Promise<UpdateResult>{
  const db = await getDB();
  
  const resume = await db.collection<Resume>("resumes").updateOne({
    _id: new ObjectId(resumeId),
    userId: new ObjectId(userId),
    analysisCount: { $gt: 0 },
  }, {
    $inc:{
      analysisCount: -1
    }
  });

  return resume;
}

export async function fetchResumeCountByUserId(
  userId:string
){
  const db = await getDB();
  
  const count = await db.collection<Resume>("resumes").countDocuments({
    userId: new ObjectId(userId)
  });

  return count;
}

export async function deleteResumesByUserId(
  userId:string
): Promise<DeleteResult>{
  const db = await getDB();

  const result = await db.collection<Resume>("resumes").deleteMany({
    userId: new ObjectId(userId)
  });

  return result;
}

export async function deleteResumeById(
  resumeId: string,
  userId:string
):Promise<DeleteResult>{
  const db = await getDB();

  const result = await db.collection<Resume>("resumes").deleteOne({
    _id: new ObjectId(resumeId),
    userId: new ObjectId(userId)
  });

  return result;
}
