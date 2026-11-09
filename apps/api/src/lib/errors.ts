export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string = "ERROR",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new HttpError(400, message, "BAD_REQUEST", details);

export const unauthorized = (message = "Authentication required") =>
  new HttpError(401, message, "UNAUTHORIZED");

export const notFound = (what = "Resource") => new HttpError(404, `${what} not found`, "NOT_FOUND");

export const conflict = (message: string) => new HttpError(409, message, "CONFLICT");

export const serviceUnavailable = (message: string) =>
  new HttpError(503, message, "SERVICE_UNAVAILABLE");
