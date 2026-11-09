import type { Request, Response } from "express";
import { param } from "../../lib/http";
import * as caseStudiesService from "./caseStudies.service";

export async function getPublished(req: Request, res: Response) {
  res.json(await caseStudiesService.getPublished(param(req, "id")));
}

export async function getForAdmin(req: Request, res: Response) {
  res.json(await caseStudiesService.getForAdmin(param(req, "id")));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await caseStudiesService.create(req.body));
}

export async function update(req: Request, res: Response) {
  res.json(await caseStudiesService.update(param(req, "id"), req.body));
}

export async function remove(req: Request, res: Response) {
  await caseStudiesService.remove(param(req, "id"));
  res.status(204).end();
}
