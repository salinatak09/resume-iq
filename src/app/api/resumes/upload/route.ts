import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDB } from "@/lib/db";
import { saveResumeFile } from "@/lib/storage/local";
import { extractPdfText } from "@/lib/pdf";
import { requireSession } from "@/server/auth";
import { ApiError, UnauthorizedError } from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "PDF file is required",
        },
        {
          status: 400,
        }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF files are allowed",
        },
        {
          status: 400,
        }
      );
    }

    // 10 MB limit for now
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size must be less than 10MB",
        },
        {
          status: 400,
        }
      );
    }

    // Save PDF first in local directory
    // const savedFile = await saveResumeFile(
    //   userId,
    //   resumeId.toString(),
    //   file
    // );

    // convert pdf content into Uint8Array (acceptable for PDFParser)
    const pdfData = new Uint8Array(await file.arrayBuffer());

    // Extract text
    const extractedText = await extractPdfText(pdfData);

    if (!extractedText) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract text from this PDF",
        },
        {
          status: 400,
        }
      );
    }

    const now = new Date();
    const resumeId = new ObjectId();
    const db = await getDB();

    const resume = {
      _id: resumeId,
      userId,
      title: file.name.replace(/\.pdf$/i, ""),
      extractedText,
    //   originalFileName: file.name,
    //   filePath: savedFile.filePath,
    //   mimeType: "application/pdf" as const,
    //   fileSize: file.size,
    //   extractedText,
    //   status: "COMPLETED" as const,
      createdAt: now,
      updatedAt: now,
    };

    // Save pdf text in DB
    await db.collection("resumes").insertOne(resume);

    return NextResponse.json(
      {
        success: true,

        resume: {
          id: resumeId.toString(),
          text: extractedText,
          title: resume.title,
          // originalFileName:
          // resume.originalFileName,
          // status: resume.status,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: error.statusCode,
        }
      );
    }

    console.error("Resume upload failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload resume",
      },
      {
        status: 500,
      }
    );
  }
}
