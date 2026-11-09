import { z } from "zod";
import { urlOrPathSchema } from "../../lib/validation";

export const createResourceSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    fileUrl: urlOrPathSchema,
    lessonId: z.string().min(1).optional(),
    caseStudyId: z.string().min(1).optional(),
  })
  .refine((value) => Boolean(value.lessonId) !== Boolean(value.caseStudyId), {
    message: "Provide exactly one of lessonId or caseStudyId",
    path: ["lessonId"],
  });

export const updateResourceSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  fileUrl: urlOrPathSchema.optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
