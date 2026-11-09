import type { SignUploadResponse, UploadKind } from "@assetizers/shared";
import { api } from "../../lib/api";

const EXTENSION_MIME: Record<string, string> = {
  pdf: "application/pdf",
  csv: "text/csv",
  txt: "text/plain",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

function mimeTypeOf(file: File) {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MIME[extension] ?? "application/octet-stream";
}

function send(
  method: "POST" | "PUT",
  url: string,
  body: XMLHttpRequestBodyInit,
  headers: Record<string, string>,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve(xhr.responseText)
        : reject(new Error(`Upload failed (${xhr.status})`));
    xhr.onerror = () =>
      reject(new Error("Upload failed. Check the storage bucket's CORS settings and your connection."));
    xhr.send(body);
  });
}

/**
 * Uploads a file straight from the browser to storage using a signature from the API,
 * and resolves to the URL to save in the database.
 */
export async function uploadFile(
  file: File,
  kind: UploadKind,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const mimeType = mimeTypeOf(file);
  const signed = await api.post<SignUploadResponse>("/api/admin/uploads/sign", {
    kind,
    fileName: file.name,
    mimeType,
    size: file.size,
  });

  if (signed.provider === "cloudinary") {
    const form = new FormData();
    for (const [key, value] of Object.entries(signed.fields)) form.append(key, value);
    form.append("file", file);
    const response = JSON.parse(await send("POST", signed.uploadUrl, form, {}, onProgress)) as {
      secure_url?: string;
    };
    if (!response.secure_url) throw new Error("Cloudinary did not return a file URL");
    return response.secure_url;
  }

  await send("PUT", signed.uploadUrl, file, signed.headers, onProgress);
  return signed.fileUrl;
}
