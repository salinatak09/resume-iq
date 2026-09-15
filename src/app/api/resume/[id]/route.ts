import { getDB } from "@/lib/db";
import { ApiError } from "@/lib/errors";
import { requireSession } from "@/server/auth";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Get resume of given id of current user - /api/resume/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
){
  try {

    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // get Database
    const db = await getDB();
    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid resume ID",
        },
        {
          status: 400,
        }
      );
    }


    // Get resume of given id for current logged in user
    const resume = await db.collection("resumes").findOne(
      { 
        _id: new ObjectId(id),
        userId,
      }
    );

    if(!resume){
      return NextResponse.json(
        {
          success: false,
          error: "Resume not found",
        },
        {
          status: 404,
        }
      );
    }

    console.log(resume);

    return NextResponse.json(
      {
        success: true,
        resumes: {
          id: resume._id.toString(),
          ...resume,
          _id: undefined
        }
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

    console.error("Failed to fetch resume:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch resume",
      },
      {
        status: 500,
      }
    );
  }
}

// Delete resume of given id of current user - /api/resume/:id
export async function Delete(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
){
  try {

    // Authentication
    const session = await requireSession();
    const userId = session.user.id;

    // get Database
    const db = await getDB();
    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid resume ID",
        },
        {
          status: 400,
        }
      );
    }


    // Get resume of given id for current logged in user
    const result = await db.collection("resumes").deleteOne(
      { 
        _id: new ObjectId(id),
        userId,
      }
    );

    // Resume not found or doesn't belong to user
    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Resume deleted successfully",
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

    console.error("Failed to delete resume:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete resume",
      },
      {
        status: 500,
      }
    );
  }
}