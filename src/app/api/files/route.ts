import { NextRequest } from "next/server";
import { getUserId, createResponseWithCookie } from "@/lib/cookies";
import { fileStore } from "@/lib/file-store";
import { FileMetadata } from "@/lib/types";

// POST /api/files - Upload files for the current user
export async function POST(request: NextRequest) {
  const userId = await getUserId(request);

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return createResponseWithCookie(
        { detail: "No files provided" },
        userId,
        400
      );
    }

    const results: FileMetadata[] = [];
    for (const file of files) {
      const metadata = await fileStore.saveUpload(file, userId);
      results.push(metadata);
    }

    return createResponseWithCookie(results, userId);
  } catch (error) {
    console.error("File upload error:", error);
    return createResponseWithCookie(
      { detail: "Failed to upload files" },
      userId,
      500
    );
  }
}

// GET /api/files - List files for the current user
export async function GET(request: NextRequest) {
  const userId = await getUserId(request);

  try {
    const files = await fileStore.listFiles(userId);
    return createResponseWithCookie(files, userId);
  } catch (error) {
    console.error("File list error:", error);
    return createResponseWithCookie(
      { detail: "Failed to list files" },
      userId,
      500
    );
  }
}
