import type { Request, Response } from "express";
import { param } from "../../lib/http";
import * as lessonsService from "./lessons.service";

export async function getPublished(req: Request, res: Response) {
  res.json(await lessonsService.getPublished(param(req, "id")));
}

export async function getForAdmin(req: Request, res: Response) {
  res.json(await lessonsService.getForAdmin(param(req, "id")));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await lessonsService.create(req.body));
}

export async function update(req: Request, res: Response) {
  res.json(await lessonsService.update(param(req, "id"), req.body));
}

export async function remove(req: Request, res: Response) {
  await lessonsService.remove(param(req, "id"));
  res.status(204).end();
}

export async function reorder(req: Request, res: Response) {
  await lessonsService.reorder(req.body.ids);
  res.status(204).end();
}
