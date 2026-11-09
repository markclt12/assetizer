import { z } from "zod";
import { reorderSchema } from "../../lib/validation";

export const checkAnswersSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedIdx: z.number().int().min(0).nullable(),
      }),
    )
    .max(200),
});

export const createActivitySchema = z.object({
  sectionId: z.string().min(1),
  title: z.string().trim().min(1).max(200),
});

export const updateActivitySchema = z.object({
  title: z.string().trim().min(1).max(200),
});

const optionsSchema = z.array(z.string().trim().min(1).max(500)).min(2).max(8);

export const createQuestionSchema = z
  .object({
    activityId: z.string().min(1),
    prompt: z.string().trim().min(1).max(2000),
    options: optionsSchema,
    correctIdx: z.number().int().min(0),
    explanation: z.string().trim().max(2000).nullable().optional(),
  })
  .refine((value) => value.correctIdx < value.options.length, {
    message: "correctIdx must point to one of the options",
    path: ["correctIdx"],
  });

export const updateQuestionSchema = z.object({
  prompt: z.string().trim().min(1).max(2000).optional(),
  options: optionsSchema.optional(),
  correctIdx: z.number().int().min(0).optional(),
  explanation: z.string().trim().max(2000).nullable().optional(),
});

export const reorderQuestionsSchema = reorderSchema;

export type CheckAnswersInput = z.infer<typeof checkAnswersSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
