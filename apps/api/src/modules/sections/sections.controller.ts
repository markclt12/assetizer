import type { Request, Response } from "express";
import { param } from "../../lib/http";
import * as sectionsService from "./sections.service";

export async function getDetail(req: Request, res: Response) {
  res.json(await sectionsService.getDetail(param(req, "id")));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await sectionsService.create(req.body));
}

export async function update(req: Request, res: Response) {
  res.json(await sectionsService.update(param(req, "id"), req.body));
}

export async function remove(req: Request, res: Response) {
  await sectionsService.remove(param(req, "id"));
  res.status(204).end();
}

export async function reorder(req: Request, res: Response) {
  await sectionsService.reorder(req.body.ids);
  res.status(204).end();
}
