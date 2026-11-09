import { Router } from "express";
import { validate } from "../../middlewares/validate";
import * as controller from "./lessons.controller";
import { createLessonSchema, reorderLessonsSchema, updateLessonSchema } from "./lessons.schema";

export const publicLessonsRouter = Router();
publicLessonsRouter.get("/:id", controller.getPublished);

export const adminLessonsRouter = Router();
adminLessonsRouter.post("/", validate(createLessonSchema), controller.create);
adminLessonsRouter.patch("/reorder", validate(reorderLessonsSchema), controller.reorder);
adminLessonsRouter.get("/:id", controller.getForAdmin);
adminLessonsRouter.patch("/:id", validate(updateLessonSchema), controller.update);
adminLessonsRouter.delete("/:id", controller.remove);
