import { Router } from "express";
import { validate } from "../../middlewares/validate";
import * as controller from "./resources.controller";
import { createResourceSchema, updateResourceSchema } from "./resources.schema";

export const adminResourcesRouter = Router();
adminResourcesRouter.post("/", validate(createResourceSchema), controller.create);
adminResourcesRouter.patch("/:id", validate(updateResourceSchema), controller.update);
adminResourcesRouter.delete("/:id", controller.remove);
