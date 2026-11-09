import { z } from "zod";
import type { UploadKind } from "@assetizers/shared";

const MB = 1024 * 1024;

export const UPLOAD_RULES: Record<UploadKind, { mimeTypes: string[]; maxBytes: number }> = {
  video: {
    mimeTypes: ["video/mp4", "video/webm", "video/quicktime"],
    maxBytes: 500 * MB,
  },
  image: {
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"],
    maxBytes: 10 * MB,
  },
  file: {
    mimeTypes: [
      "application/pdf",
      "text/csv",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    maxBytes: 50 * MB,
  },
};

export const signUploadSchema = z
  .object({
    kind: z.enum(["video", "image", "file"]),
    fileName: z.string().trim().min(1).max(255),
    mimeType: z.string().trim().toLowerCase().min(1),
    size: z.number().int().positive(),
  })
  .superRefine((value, ctx) => {
    const rules = UPLOAD_RULES[value.kind];
    if (!rules.mimeTypes.includes(value.mimeType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mimeType"],
        message: `Unsupported ${value.kind} type. Allowed: ${rules.mimeTypes.join(", ")}`,
      });
    }
    if (value.size > rules.maxBytes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["size"],
        message: `File too large. Max ${Math.round(rules.maxBytes / MB)} MB for ${value.kind}`,
      });
    }
  });

export type SignUploadInput = z.infer<typeof signUploadSchema>;
