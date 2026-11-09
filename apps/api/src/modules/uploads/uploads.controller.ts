import type { Request, Response } from "express";
import { param } from "../../lib/http";
import * as uploadsService from "./uploads.service";

export async function sign(req: Request, res: Response) {
  res.json(await uploadsService.sign(req.body));
}

export async function serveFile(req: Request, res: Response) {
  const url = await uploadsService.resolveFileUrl(param(req, "key"));
  res.set("Cache-Control", "private, max-age=300");
  res.redirect(302, url);
}
