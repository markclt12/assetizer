import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AdminTokenPayload {
  sub: string;
  email: string;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (typeof decoded === "string" || typeof decoded.sub !== "string") return null;
    return { sub: decoded.sub, email: String(decoded.email ?? "") };
  } catch {
    return null;
  }
}
