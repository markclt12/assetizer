import { Router } from "express";
import { validate } from "../../middlewares/validate";
import * as controller from "./courses.controller";
import { createCourseSchema, reorderCoursesSchema, updateCourseSchema } from "./courses.schema";

export const publicCoursesRouter = Router();
publicCoursesRouter.get("/", controller.listPublished);
publicCoursesRouter.get("/:slug", controller.getPublished);
publicCoursesRouter.get("/:slug/topics/:topicSlug", controller.getPublishedTopic);

export const adminCoursesRouter = Router();
adminCoursesRouter.get("/", controller.listAll);
adminCoursesRouter.post("/", validate(createCourseSchema), controller.create);
adminCoursesRouter.patch("/reorder", validate(reorderCoursesSchema), controller.reorder);
adminCoursesRouter.get("/:id", controller.getDetail);
adminCoursesRouter.patch("/:id", validate(updateCourseSchema), controller.update);
adminCoursesRouter.delete("/:id", controller.remove);
