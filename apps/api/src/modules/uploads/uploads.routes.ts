import { Router } from "express";
import { validate } from "../../middlewares/validate";
import * as controller from "./uploads.controller";
import { signUploadSchema } from "./uploads.schema";

export const adminUploadsRouter = Router();
adminUploadsRouter.post("/sign", validate(signUploadSchema), controller.sign);

export const publicFilesRouter = Router();
publicFilesRouter.get("/*key", controller.serveFile);
