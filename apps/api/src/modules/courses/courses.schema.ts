import { z } from "zod";
import { reorderSchema, slugSchema, urlOrPathSchema } from "../../lib/validation";

export const createCourseSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: slugSchema,
  description: z.string().trim().max(5000).default(""),
  thumbnail: urlOrPathSchema.nullable().optional(),
  isPublished: z.boolean().default(false),
});

export const updateCourseSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  slug: slugSchema.optional(),
  description: z.string().trim().max(5000).optional(),
  thumbnail: urlOrPathSchema.nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const reorderCoursesSchema = reorderSchema;

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
