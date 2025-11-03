import fs from "fs";
import { put } from "@vercel/blob";

export const uploadToVercelBlob = async (filePath: string): Promise<string> => {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = filePath.split("/").pop()!;
  const token = process.env.BLOB_READ_WRITE_TOKEN; // ✅ read from env

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing in environment variables");
  }

  const blob = await put(fileName, fileBuffer, {
    access: "public",
    token, // ✅ explicitly pass it
  });

  return blob.url;
};
