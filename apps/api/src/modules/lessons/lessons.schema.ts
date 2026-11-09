import { z } from "zod";
import { reorderSchema, urlOrPathSchema } from "../../lib/validation";

export const createLessonSchema = z.object({
  sectionId: z.string().min(1),
  title: z.string().trim().min(1).max(200),
  content: z.string().max(100_000).default(""),
  videoUrl: urlOrPathSchema.nullable().optional(),
});

export const updateLessonSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().max(100_000).optional(),
  videoUrl: urlOrPathSchema.nullable().optional(),
});

export const reorderLessonsSchema = reorderSchema;

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
