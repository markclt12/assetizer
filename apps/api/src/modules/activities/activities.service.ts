import type {
  AdminActivityDto,
  AdminQuestionDto,
  CheckAnswersResponse,
  PublicActivityDto,
} from "@assetizers/shared";
import { prisma } from "../../lib/prisma";
import { badRequest, conflict, notFound } from "../../lib/errors";
import { assertCompleteReorder, nextPosition } from "../../lib/ordering";
import { definedOnly } from "../../lib/validation";
import type {
  CheckAnswersInput,
  CreateActivityInput,
  CreateQuestionInput,
  UpdateActivityInput,
  UpdateQuestionInput,
} from "./activities.schema";

const parentSelect = {
  id: true,
  slug: true,
  title: true,
  course: { select: { id: true, slug: true, title: true, isPublished: true } },
} as const;

/* --------------------------------- Public --------------------------------- */

export async function getPublished(id: string): Promise<PublicActivityDto> {
  const row = await prisma.activity.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      section: { select: parentSelect },
      // The answer key (correctIdx, explanation) is deliberately not selected.
      questions: {
        orderBy: { position: "asc" },
        select: { id: true, prompt: true, options: true, position: true },
      },
    },
  });
  if (!row || !row.section.course.isPublished) throw notFound("Activity");

  return {
    id: row.id,
    title: row.title,
    category: { slug: row.section.course.slug, title: row.section.course.title },
    topic: { slug: row.section.slug, title: row.section.title },
    questions: row.questions,
  };
}

/** Stateless: compares answers against the key and returns feedback. Nothing is written. */
export async function checkAnswers(id: string, input: CheckAnswersInput): Promise<CheckAnswersResponse> {
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: {
      section: { select: { course: { select: { isPublished: true } } } },
      questions: {
        orderBy: { position: "asc" },
        select: { id: true, options: true, correctIdx: true, explanation: true },
      },
    },
  });
  if (!activity || !activity.section.course.isPublished) throw notFound("Activity");

  const submitted = new Map(input.answers.map((answer) => [answer.questionId, answer.selectedIdx]));
  const known = new Set(activity.questions.map((question) => question.id));
  const unknown = input.answers.filter((answer) => !known.has(answer.questionId));
  if (unknown.length > 0) {
    throw badRequest("Some answers reference questions outside this activity", {
      questionIds: unknown.map((answer) => answer.questionId),
    });
  }

  const results = activity.questions.map((question) => {
    const selectedIdx = submitted.get(question.id) ?? null;
    return {
      questionId: question.id,
      selectedIdx,
      correct: selectedIdx === question.correctIdx,
      correctIdx: question.correctIdx,
      explanation: question.explanation,
    };
  });

  return {
    results,
    score: results.filter((result) => result.correct).length,
    total: results.length,
  };
}

/* ---------------------------------- Admin --------------------------------- */

export async function getForAdmin(id: string): Promise<AdminActivityDto> {
  const row = await prisma.activity.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      section: { select: parentSelect },
      questions: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          prompt: true,
          options: true,
          correctIdx: true,
          explanation: true,
          position: true,
        },
      },
    },
  });
  if (!row) throw notFound("Activity");

  return {
    id: row.id,
    title: row.title,
    category: { id: row.section.course.id, title: row.section.course.title },
    topic: { id: row.section.id, title: row.section.title },
    questions: row.questions,
  };
}

export async function create(input: CreateActivityInput): Promise<AdminActivityDto> {
  const section = await prisma.section.findUnique({
    where: { id: input.sectionId },
    select: { id: true, activity: { select: { id: true } } },
  });
  if (!section) throw notFound("Topic");
  if (section.activity) throw conflict("This topic already has an activity");

  const activity = await prisma.activity.create({
    data: { sectionId: input.sectionId, title: input.title },
  });
  return getForAdmin(activity.id);
}

export async function update(id: string, input: UpdateActivityInput): Promise<AdminActivityDto> {
  await prisma.activity.update({ where: { id }, data: { title: input.title } });
  return getForAdmin(id);
}

export async function remove(id: string): Promise<void> {
  await prisma.activity.delete({ where: { id } });
}

const questionSelect = {
  id: true,
  prompt: true,
  options: true,
  correctIdx: true,
  explanation: true,
  position: true,
} as const;

export async function createQuestion(input: CreateQuestionInput): Promise<AdminQuestionDto> {
  const activity = await prisma.activity.findUnique({ where: { id: input.activityId }, select: { id: true } });
  if (!activity) throw notFound("Activity");

  const { _max } = await prisma.question.aggregate({
    where: { activityId: input.activityId },
    _max: { position: true },
  });
  return prisma.question.create({
    data: {
      activityId: input.activityId,
      prompt: input.prompt,
      options: input.options,
      correctIdx: input.correctIdx,
      explanation: input.explanation ?? null,
      position: nextPosition(_max.position),
    },
    select: questionSelect,
  });
}

export async function updateQuestion(id: string, input: UpdateQuestionInput): Promise<AdminQuestionDto> {
  const existing = await prisma.question.findUnique({
    where: { id },
    select: { options: true, correctIdx: true },
  });
  if (!existing) throw notFound("Question");

  const options = input.options ?? existing.options;
  const correctIdx = input.correctIdx ?? existing.correctIdx;
  if (correctIdx >= options.length) {
    throw badRequest("correctIdx must point to one of the options");
  }

  return prisma.question.update({
    where: { id },
    data: definedOnly(input),
    select: questionSelect,
  });
}

export async function removeQuestion(id: string): Promise<void> {
  await prisma.question.delete({ where: { id } });
}

export async function reorderQuestions(ids: string[]): Promise<void> {
  const found = await prisma.question.findMany({ where: { id: { in: ids } }, select: { activityId: true } });
  await assertCompleteReorder(
    ids,
    found.map((row) => ({ parentId: row.activityId })),
    (activityId) => prisma.question.count({ where: { activityId } }),
  );
  await prisma.$transaction(
    ids.map((id, position) => prisma.question.update({ where: { id }, data: { position } })),
  );
}
