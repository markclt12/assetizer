import type { Request, Response } from "express";
import { param } from "../../lib/http";
import * as activitiesService from "./activities.service";

export async function getPublished(req: Request, res: Response) {
  res.json(await activitiesService.getPublished(param(req, "id")));
}

export async function check(req: Request, res: Response) {
  res.json(await activitiesService.checkAnswers(param(req, "id"), req.body));
}

export async function getForAdmin(req: Request, res: Response) {
  res.json(await activitiesService.getForAdmin(param(req, "id")));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await activitiesService.create(req.body));
}

export async function update(req: Request, res: Response) {
  res.json(await activitiesService.update(param(req, "id"), req.body));
}

export async function remove(req: Request, res: Response) {
  await activitiesService.remove(param(req, "id"));
  res.status(204).end();
}

export async function createQuestion(req: Request, res: Response) {
  res.status(201).json(await activitiesService.createQuestion(req.body));
}

export async function updateQuestion(req: Request, res: Response) {
  res.json(await activitiesService.updateQuestion(param(req, "id"), req.body));
}

export async function removeQuestion(req: Request, res: Response) {
  await activitiesService.removeQuestion(param(req, "id"));
  res.status(204).end();
}

export async function reorderQuestions(req: Request, res: Response) {
  await activitiesService.reorderQuestions(req.body.ids);
  res.status(204).end();
}
