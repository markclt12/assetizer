import cors from "cors";
import express, { Router } from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { requireAdmin } from "./middlewares/requireAdmin";
import { adminActivitiesRouter, adminQuestionsRouter, publicActivitiesRouter } from "./modules/activities/activities.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { adminCaseStudiesRouter, publicCaseStudiesRouter } from "./modules/caseStudies/caseStudies.routes";
import { adminCoursesRouter, publicCoursesRouter } from "./modules/courses/courses.routes";
import { adminLessonsRouter, publicLessonsRouter } from "./modules/lessons/lessons.routes";
import { adminResourcesRouter } from "./modules/resources/resources.routes";
import { adminSectionsRouter } from "./modules/sections/sections.routes";
import { adminUploadsRouter, publicFilesRouter } from "./modules/uploads/uploads.routes";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: env.clientUrls }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Public
  app.use("/api/auth", authRouter);
  app.use("/api/courses", publicCoursesRouter);
  app.use("/api/lessons", publicLessonsRouter);
  app.use("/api/activities", publicActivitiesRouter);
  app.use("/api/case-studies", publicCaseStudiesRouter);
  app.use("/api/files", publicFilesRouter);

  // Admin
  const admin = Router();
  admin.use(requireAdmin);
  admin.use("/courses", adminCoursesRouter);
  admin.use("/sections", adminSectionsRouter);
  admin.use("/lessons", adminLessonsRouter);
  admin.use("/resources", adminResourcesRouter);
  admin.use("/activities", adminActivitiesRouter);
  admin.use("/questions", adminQuestionsRouter);
  admin.use("/case-studies", adminCaseStudiesRouter);
  admin.use("/uploads", adminUploadsRouter);
  app.use("/api/admin", admin);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
