import { getDB } from "@/lib/db";
import { ApiError } from "@/lib/errors";
import { requireSession } from "@/server/auth";
import { NextResponse } from "next/server";

// Get all resumes of current user - /api/resumes
export async function GET(){
  try {

    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // get Database
    const db = await getDB();

    // Get all resumes for current logged in user
    const resumes = await db.collection("resumes").find(
        { userId },
        {
          projection: {
            _id: 1,
            title: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    console.log(resumes);

    return NextResponse.json(
      {
        success: true,
        resumes: resumes.map((resume)=>({
          id: resume._id.toString(),
          title: resume.title,
          createdAt: resume.createdAt,
        }))
      },
      {
        status: 200
      }
    )
  } catch(error){
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

    console.error("Failed to fetch resumes:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch resumes",
      },
      {
        status: 500,
      }
    );
  }
}

// Delete all resume of current user- /api/resume
export async function DELETE(){
  try {

    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // get Database
    const db = await getDB();

    // Delete Resumes of current logged in user
    const result = await db.collection("resumes").deleteMany({ 
      userId
    });

    console.log(result);

    return NextResponse.json(
      {
        success: true,
        message: "All resumes deleted successfully",
        deletedCount: result.deletedCount,
      },
      {
        status: 200
      }
    )
  } catch(error){
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

    console.error("Failed to delete resumes:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete resumes",
      },
      {
        status: 500,
      }
    );
  }
}