import type { SignUploadResponse } from "@assetizers/shared";
import { env } from "../../config/env";
import { badRequest, notFound } from "../../lib/errors";
import { createSignedDownloadUrl, createSignedUpload, STORAGE_PREFIXES } from "../../lib/storage";
import type { SignUploadInput } from "./uploads.schema";

export function sign(input: SignUploadInput): Promise<SignUploadResponse> {
  return createSignedUpload(input);
}

const allowedPrefixes = Object.values(STORAGE_PREFIXES).map((prefix) => `${prefix}/`);

/** Resolves a stored object key to a short-lived download URL (private S3 buckets only). */
export async function resolveFileUrl(key: string): Promise<string> {
  if (env.storage.provider !== "s3") throw notFound("File");
  if (key.includes("..") || !allowedPrefixes.some((prefix) => key.startsWith(prefix))) {
    throw badRequest("Invalid file path");
  }
  return createSignedDownloadUrl(key);
}
