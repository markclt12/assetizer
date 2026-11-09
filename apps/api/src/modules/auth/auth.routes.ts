import { Router } from "express";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { validate } from "../../middlewares/validate";
import * as controller from "./auth.controller";
import { loginSchema } from "./auth.schema";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), controller.login);
authRouter.get("/me", requireAdmin, controller.me);
