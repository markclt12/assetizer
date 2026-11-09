import type { Request, Response } from "express";
import { param } from "../../lib/http";
import * as coursesService from "./courses.service";

export async function listPublished(_req: Request, res: Response) {
  res.json(await coursesService.listPublished());
}

export async function getPublished(req: Request, res: Response) {
  res.json(await coursesService.getPublishedBySlug(param(req, "slug")));
}

export async function getPublishedTopic(req: Request, res: Response) {
  res.json(await coursesService.getPublishedTopic(param(req, "slug"), param(req, "topicSlug")));
}

export async function listAll(_req: Request, res: Response) {
  res.json(await coursesService.listAll());
}

export async function getDetail(req: Request, res: Response) {
  res.json(await coursesService.getDetail(param(req, "id")));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await coursesService.create(req.body));
}

export async function update(req: Request, res: Response) {
  res.json(await coursesService.update(param(req, "id"), req.body));
}

export async function remove(req: Request, res: Response) {
  await coursesService.remove(param(req, "id"));
  res.status(204).end();
}

export async function reorder(req: Request, res: Response) {
  res.json(await coursesService.reorder(req.body.ids));
}
