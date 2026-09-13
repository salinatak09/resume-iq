import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(
  process.cwd(),
  "uploads",
  "resumes"
);

export async function saveResumeFile(
  userId: string,
  resumeId: string,
  file: File
) {
  const userDirectory = path.join(
    UPLOAD_DIR,
    userId
  );

  await fs.mkdir(userDirectory, {
    recursive: true,
  });

  const fileName = `${resumeId}.pdf`;

  const filePath = path.join(
    userDirectory,
    fileName
  );

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  await fs.writeFile(filePath, buffer);

  return {
    filePath,
    fileName,
    data: new Uint8Array(buffer)
  };
}
