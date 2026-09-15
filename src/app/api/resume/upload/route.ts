import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDB } from "@/lib/db";
// import { saveResumeFile } from "@/lib/storage/local";
import { extractPdfText } from "@/lib/pdf";
import { requireSession } from "@/server/auth";
import { ApiError } from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {

    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // Read Upload
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

    // Validate File type & File size
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

    // convert pdf content into Uint8Array (acceptable for PDFParser)
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const pdfHeader = new TextDecoder().decode(bytes.slice(0, 5));

    if (bytes.length < 5 || pdfHeader !== "%PDF-") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid PDF file",
        },
        { status: 400 }
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

    // Generate Resume Id
    const resumeId = new ObjectId();

    // Save PDF first in local directory
    // const savedFile = await saveResumeFile(
    //   userId,
    //   resumeId.toString(),
    //   file
    // );

    // TODO: Save pdf in cloud storage

    // Extract text
    const extractedText = await extractPdfText(bytes);
    const normalizedText = extractedText.replace(/\s+/g, " ").trim();

    if (!normalizedText) {
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

    if (normalizedText.length < 100) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract enough text from this PDF",
        },
        { status: 422 }
      );
    }

    // Create & Insert Resume data in MongoDB 
    const now = new Date();
    const db = await getDB();

    const resume = {
      _id: resumeId,
      userId,
      title: file.name.replace(/\.pdf$/i, "").trim().slice(0, 200),
      extractedText,
    //   originalFileName: file.name,
    //   filePath: savedFile.filePath,
    //   mimeType: "application/pdf" as const,
    //   fileSize: file.size,
    //   status: "COMPLETED" as const,
      createdAt: now,
      updatedAt: now,
    };

    // Save pdf text in DB
    await db.collection("resumes").insertOne(resume);

    // TODO: Analyze resume
    // Decide should be store in same schema or different
    // const analysis = await analyzeResume(text);
    // then update DB

    return NextResponse.json(
      {
        success: true,
        resume: {
          id: resumeId.toString(),
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
