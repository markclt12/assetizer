import type { RequestHandler } from "express";
import { unauthorized } from "../lib/errors";
import { verifyAdminToken } from "../lib/jwt";

export const requireAdmin: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return next(unauthorized());

  const payload = verifyAdminToken(token);
  if (!payload) return next(unauthorized("Invalid or expired token"));

  req.admin = payload;
  next();
};
