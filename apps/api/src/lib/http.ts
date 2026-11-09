import type { Request } from "express";

/** Reads a route param as a single string (wildcard params arrive as arrays). */
export function param(req: Request, name: string): string {
  const value = req.params[name] as string | string[] | undefined;
  if (Array.isArray(value)) return value.join("/");
  return value ?? "";
}
