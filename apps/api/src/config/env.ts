import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

// The monorepo keeps a single .env at the repository root.
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
dotenv.config();

const optional = z.string().trim().min(1).optional();

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PUBLIC_URL: optional,
  CLIENT_URL: z.string().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_URL_POOLED: optional,

  JWT_SECRET: optional,
  JWT_EXPIRES_IN: z.string().default("1d"),

  CLOUDINARY_CLOUD_NAME: optional,
  CLOUDINARY_API_KEY: optional,
  CLOUDINARY_API_SECRET: optional,

  AWS_ENDPOINT_URL_S3: optional,
  AWS_ACCESS_KEY_ID: optional,
  AWS_SECRET_ACCESS_KEY: optional,
  AWS_REGION: z.string().default("auto"),
  S3_BUCKET: optional,
  S3_PUBLIC_BASE_URL: optional,
});

// Treat empty strings in .env as "not set".
const raw = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== undefined && value.trim() !== ""),
);

const parsed = schema.safeParse(raw);
if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

const values = parsed.data;

if (!values.JWT_SECRET) {
  if (values.NODE_ENV === "production") {
    console.error("JWT_SECRET is required in production.");
    process.exit(1);
  }
  console.warn("JWT_SECRET is not set; using an insecure development secret.");
}

type StorageConfig =
  | {
      provider: "cloudinary";
      cloudName: string;
      apiKey: string;
      apiSecret: string;
    }
  | {
      provider: "s3";
      endpoint: string | undefined;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
      bucket: string;
      publicBaseUrl: string | undefined;
    }
  | { provider: "none" };

function resolveStorage(): StorageConfig {
  if (values.CLOUDINARY_CLOUD_NAME && values.CLOUDINARY_API_KEY && values.CLOUDINARY_API_SECRET) {
    return {
      provider: "cloudinary",
      cloudName: values.CLOUDINARY_CLOUD_NAME,
      apiKey: values.CLOUDINARY_API_KEY,
      apiSecret: values.CLOUDINARY_API_SECRET,
    };
  }
  if (values.AWS_ACCESS_KEY_ID && values.AWS_SECRET_ACCESS_KEY && values.S3_BUCKET) {
    return {
      provider: "s3",
      endpoint: values.AWS_ENDPOINT_URL_S3,
      region: values.AWS_REGION,
      accessKeyId: values.AWS_ACCESS_KEY_ID,
      secretAccessKey: values.AWS_SECRET_ACCESS_KEY,
      bucket: values.S3_BUCKET,
      publicBaseUrl: values.S3_PUBLIC_BASE_URL?.replace(/\/+$/, ""),
    };
  }
  return { provider: "none" };
}

export const env = {
  nodeEnv: values.NODE_ENV,
  isProduction: values.NODE_ENV === "production",
  port: values.PORT,
  apiPublicUrl: (values.API_PUBLIC_URL ?? `http://localhost:${values.PORT}`).replace(/\/+$/, ""),
  clientUrls: values.CLIENT_URL.split(",").map((url) => url.trim()),
  databaseUrl: values.DATABASE_URL_POOLED ?? values.DATABASE_URL,
  jwtSecret: values.JWT_SECRET ?? "assetizers-dev-only-insecure-secret",
  jwtExpiresIn: values.JWT_EXPIRES_IN,
  storage: resolveStorage(),
} as const;
