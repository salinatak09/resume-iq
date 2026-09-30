import { ObjectId } from "mongodb";

export interface Resume {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  // originalFileName: string;
  // filePath: string;
  // mimeType: "application/pdf";
  fileSize: number;
  extractedText: string;
  status: "UPLOADED" | "FAILED";
  analysisCount: number,
  createdAt: Date;
  updatedAt: Date;
}