import crypto from "node:crypto";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { SignUploadResponse, UploadKind } from "@assetizers/shared";
import { env } from "../config/env";
import { serviceUnavailable } from "./errors";

const UPLOAD_URL_TTL_SECONDS = 15 * 60;
const DOWNLOAD_URL_TTL_SECONDS = 60 * 60;

/** Top-level key prefixes. The public file proxy only serves keys under these. */
export const STORAGE_PREFIXES: Record<UploadKind, string> = {
  video: "videos",
  image: "images",
  file: "files",
};

let s3Client: S3Client | null = null;

function getS3() {
  if (env.storage.provider !== "s3") throw serviceUnavailable("S3 storage is not configured");
  if (!s3Client) {
    s3Client = new S3Client({
      region: env.storage.region,
      endpoint: env.storage.endpoint,
      forcePathStyle: Boolean(env.storage.endpoint),
      credentials: {
        accessKeyId: env.storage.accessKeyId,
        secretAccessKey: env.storage.secretAccessKey,
      },
    });
  }
  return { client: s3Client, config: env.storage };
}

function sanitizeFileName(fileName: string) {
  const cleaned = fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return cleaned.slice(-80) || "upload";
}

function buildObjectKey(kind: UploadKind, fileName: string) {
  const now = new Date();
  const month = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const id = crypto.randomBytes(8).toString("hex");
  return `${STORAGE_PREFIXES[kind]}/${month}/${id}-${sanitizeFileName(fileName)}`;
}

function cloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export async function createSignedUpload(input: {
  kind: UploadKind;
  fileName: string;
  mimeType: string;
  size: number;
}): Promise<SignUploadResponse> {
  const storage = env.storage;

  if (storage.provider === "cloudinary") {
    const resourceType = input.kind === "file" ? "raw" : input.kind;
    const params = {
      folder: `assetizers/${STORAGE_PREFIXES[input.kind]}`,
      timestamp: String(Math.floor(Date.now() / 1000)),
    };
    return {
      provider: "cloudinary",
      method: "POST",
      uploadUrl: `https://api.cloudinary.com/v1_1/${storage.cloudName}/${resourceType}/upload`,
      fields: {
        ...params,
        api_key: storage.apiKey,
        signature: cloudinarySignature(params, storage.apiSecret),
      },
    };
  }

  if (storage.provider === "s3") {
    const { client, config } = getS3();
    const key = buildObjectKey(input.kind, input.fileName);
    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ContentType: input.mimeType,
        ContentLength: input.size,
      }),
      { expiresIn: UPLOAD_URL_TTL_SECONDS },
    );
    const fileUrl = config.publicBaseUrl
      ? `${config.publicBaseUrl}/${key}`
      : `${env.apiPublicUrl}/api/files/${key}`;
    return {
      provider: "s3",
      method: "PUT",
      uploadUrl,
      headers: { "Content-Type": input.mimeType },
      fileUrl,
    };
  }

  throw serviceUnavailable(
    "File storage is not configured. Set Cloudinary or S3 credentials in .env.",
  );
}

/** Short-lived signed GET URL for a private S3 object. */
export async function createSignedDownloadUrl(key: string): Promise<string> {
  const { client, config } = getS3();
  return getSignedUrl(client, new GetObjectCommand({ Bucket: config.bucket, Key: key }), {
    expiresIn: DOWNLOAD_URL_TTL_SECONDS,
  });
}
