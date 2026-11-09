import { Router } from "express";
import { validate } from "../../middlewares/validate";
import * as controller from "./sections.controller";
import { createSectionSchema, reorderSectionsSchema, updateSectionSchema } from "./sections.schema";

export const adminSectionsRouter = Router();
adminSectionsRouter.post("/", validate(createSectionSchema), controller.create);
adminSectionsRouter.patch("/reorder", validate(reorderSectionsSchema), controller.reorder);
adminSectionsRouter.get("/:id", controller.getDetail);
adminSectionsRouter.patch("/:id", validate(updateSectionSchema), controller.update);
adminSectionsRouter.delete("/:id", controller.remove);
