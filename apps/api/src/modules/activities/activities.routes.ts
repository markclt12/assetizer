import { Router } from "express";
import { validate } from "../../middlewares/validate";
import * as controller from "./activities.controller";
import {
  checkAnswersSchema,
  createActivitySchema,
  createQuestionSchema,
  reorderQuestionsSchema,
  updateActivitySchema,
  updateQuestionSchema,
} from "./activities.schema";

export const publicActivitiesRouter = Router();
publicActivitiesRouter.get("/:id", controller.getPublished);
publicActivitiesRouter.post("/:id/check", validate(checkAnswersSchema), controller.check);

export const adminActivitiesRouter = Router();
adminActivitiesRouter.post("/", validate(createActivitySchema), controller.create);
adminActivitiesRouter.get("/:id", controller.getForAdmin);
adminActivitiesRouter.patch("/:id", validate(updateActivitySchema), controller.update);
adminActivitiesRouter.delete("/:id", controller.remove);

export const adminQuestionsRouter = Router();
adminQuestionsRouter.post("/", validate(createQuestionSchema), controller.createQuestion);
adminQuestionsRouter.patch("/reorder", validate(reorderQuestionsSchema), controller.reorderQuestions);
adminQuestionsRouter.patch("/:id", validate(updateQuestionSchema), controller.updateQuestion);
adminQuestionsRouter.delete("/:id", controller.removeQuestion);
