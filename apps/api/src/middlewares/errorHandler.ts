import type { ErrorRequestHandler, RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { HttpError } from "../lib/errors";
import { env } from "../config/env";

function send(
  res: Parameters<ErrorRequestHandler>[2],
  status: number,
  message: string,
  code: string,
  details?: unknown,
) {
  res.status(status).json({ error: { message, code, ...(details ? { details } : {}) } });
}

export const notFoundHandler: RequestHandler = (req, res) => {
  send(res, 404, `Route ${req.method} ${req.path} not found`, "NOT_FOUND");
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return send(res, err.status, err.message, err.code, err.details);
  }

  if (err instanceof ZodError) {
    return send(res, 400, "Invalid request body", "VALIDATION_ERROR", err.flatten());
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") return send(res, 404, "Resource not found", "NOT_FOUND");
    if (err.code === "P2002") {
      return send(res, 409, "A record with this value already exists", "CONFLICT", err.meta);
    }
    if (err.code === "P2003") {
      return send(res, 400, "Related record does not exist", "BAD_REFERENCE");
    }
  }

  if (err?.type === "entity.parse.failed") {
    return send(res, 400, "Malformed JSON body", "BAD_REQUEST");
  }

  console.error(err);
  send(
    res,
    500,
    env.isProduction ? "Internal server error" : String(err?.message ?? err),
    "INTERNAL_ERROR",
  );
};
