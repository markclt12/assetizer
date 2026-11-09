import { z } from "zod";
import { reorderSchema, slugSchema, urlOrPathSchema } from "../../lib/validation";

export const createSectionSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(1).max(200),
  slug: slugSchema,
  illustration: urlOrPathSchema.nullable().optional(),
});

export const updateSectionSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  slug: slugSchema.optional(),
  illustration: urlOrPathSchema.nullable().optional(),
});

export const reorderSectionsSchema = reorderSchema;

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
