import { Router } from "express";
import { validate } from "../../middlewares/validate";
import * as controller from "./caseStudies.controller";
import { createCaseStudySchema, updateCaseStudySchema } from "./caseStudies.schema";

export const publicCaseStudiesRouter = Router();
publicCaseStudiesRouter.get("/:id", controller.getPublished);

export const adminCaseStudiesRouter = Router();
adminCaseStudiesRouter.post("/", validate(createCaseStudySchema), controller.create);
adminCaseStudiesRouter.get("/:id", controller.getForAdmin);
adminCaseStudiesRouter.patch("/:id", validate(updateCaseStudySchema), controller.update);
adminCaseStudiesRouter.delete("/:id", controller.remove);
