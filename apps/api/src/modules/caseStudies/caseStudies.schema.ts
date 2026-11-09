import { z } from "zod";

export const createCaseStudySchema = z.object({
  sectionId: z.string().min(1),
  title: z.string().trim().min(1).max(200),
  content: z.string().max(100_000).default(""),
});

export const updateCaseStudySchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().max(100_000).optional(),
});

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
