import type { Request, Response } from "express";
import { param } from "../../lib/http";
import * as resourcesService from "./resources.service";

export async function create(req: Request, res: Response) {
  res.status(201).json(await resourcesService.create(req.body));
}

export async function update(req: Request, res: Response) {
  res.json(await resourcesService.update(param(req, "id"), req.body));
}

export async function remove(req: Request, res: Response) {
  await resourcesService.remove(param(req, "id"));
  res.status(204).end();
}
