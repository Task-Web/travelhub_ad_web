import { FileMetadata } from "./types";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import mime from "mime-types";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
async function ensureUploadsDir(): Promise<void> {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

// Get user-specific directory
function getUserDir(userId: string): string {
  return path.join(UPLOADS_DIR, userId);
}

// Ensure user directory exists
async function ensureUserDir(userId: string): Promise<string> {
  const userDir = getUserDir(userId);
  try {
    await fs.access(userDir);
  } catch {
    await fs.mkdir(userDir, { recursive: true });
  }
  return userDir;
}

// Sanitize filename
function safeName(name: string): string {
  const baseName = path.basename(name);
  return baseName || "file";
}

// Parse stored filename to extract id and original name
function parseFilename(storedName: string): { id: string; name: string } {
  if (storedName.includes("__")) {
    const [fileId, originalName] = storedName.split("__", 2);
    return { id: fileId, name: originalName };
  }
  return { id: "", name: storedName };
}

// Build URL for file access
function buildUrl(filename: string): string {
  return `/api/files/${filename}`;
}

// Resolve content type from filename
function resolveContentType(name: string, fallback?: string): string {
  return fallback || mime.lookup(name) || "application/octet-stream";
}

export const fileStore = {
  async saveUpload(
    file: File,
    userId: string
  ): Promise<FileMetadata> {
    await ensureUploadsDir();
    const userDir = await ensureUserDir(userId);

    const fileId = uuidv4().replace(/-/g, "");
    const originalName = safeName(file.name);
    const storedName = `${fileId}__${originalName}`;
    const targetPath = path.join(userDir, storedName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(targetPath, buffer);

    const stats = await fs.stat(targetPath);

    return {
      id: fileId,
      name: originalName,
      size: stats.size,
      type: resolveContentType(originalName, file.type),
      url: buildUrl(storedName),
      filename: storedName,
    };
  },

  async listFiles(userId: string): Promise<FileMetadata[]> {
    const userDir = getUserDir(userId);

    try {
      await fs.access(userDir);
    } catch {
      return [];
    }

    const entries = await fs.readdir(userDir);
    const results: FileMetadata[] = [];

    for (const entry of entries.sort()) {
      const entryPath = path.join(userDir, entry);
      const stats = await fs.stat(entryPath);

      if (!stats.isFile()) continue;

      const { id, name } = parseFilename(entry);
      results.push({
        id,
        name,
        size: stats.size,
        type: resolveContentType(name),
        url: buildUrl(entry),
        filename: entry,
      });
    }

    return results;
  },

  async getFilePath(userId: string, filename: string): Promise<string | null> {
    const safeFn = path.basename(filename);
    if (safeFn !== filename) {
      return null;
    }

    const targetPath = path.join(getUserDir(userId), safeFn);

    try {
      const stats = await fs.stat(targetPath);
      if (!stats.isFile()) return null;
      return targetPath;
    } catch {
      return null;
    }
  },

  async deleteUserFiles(userId: string): Promise<void> {
    const userDir = getUserDir(userId);

    try {
      await fs.access(userDir);
    } catch {
      return;
    }

    // Safety check - ensure we're deleting within uploads dir
    const resolvedUserDir = path.resolve(userDir);
    const resolvedUploadsDir = path.resolve(UPLOADS_DIR);

    if (resolvedUserDir === resolvedUploadsDir) return;
    if (!resolvedUserDir.startsWith(resolvedUploadsDir + path.sep)) return;

    await fs.rm(resolvedUserDir, { recursive: true, force: true });
  },

  // Get filename display name (strip the UUID prefix)
  getDisplayName(filename: string): string {
    if (filename.includes("__")) {
      return filename.split("__", 2)[1];
    }
    return filename;
  },
};
