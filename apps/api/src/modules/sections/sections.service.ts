import type { AdminTopicDetailDto } from "@assetizers/shared";
import { prisma } from "../../lib/prisma";
import { notFound } from "../../lib/errors";
import { assertCompleteReorder, nextPosition } from "../../lib/ordering";
import { definedOnly } from "../../lib/validation";
import type { CreateSectionInput, UpdateSectionInput } from "./sections.schema";

export async function getDetail(id: string): Promise<AdminTopicDetailDto> {
  const row = await prisma.section.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      illustration: true,
      position: true,
      course: { select: { id: true, slug: true, title: true } },
      lessons: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          videoUrl: true,
          _count: { select: { resources: true } },
        },
      },
      activity: { select: { id: true, title: true, _count: { select: { questions: true } } } },
      caseStudy: { select: { id: true, title: true } },
    },
  });
  if (!row) throw notFound("Topic");

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    illustration: row.illustration,
    position: row.position,
    category: row.course,
    lessons: row.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      position: lesson.position,
      hasVideo: Boolean(lesson.videoUrl),
      resourceCount: lesson._count.resources,
    })),
    activity: row.activity
      ? { id: row.activity.id, title: row.activity.title, questionCount: row.activity._count.questions }
      : null,
    caseStudy: row.caseStudy,
  };
}

export async function create(input: CreateSectionInput): Promise<AdminTopicDetailDto> {
  const course = await prisma.course.findUnique({ where: { id: input.courseId }, select: { id: true } });
  if (!course) throw notFound("Category");

  const { _max } = await prisma.section.aggregate({
    where: { courseId: input.courseId },
    _max: { position: true },
  });
  const section = await prisma.section.create({
    data: {
      courseId: input.courseId,
      title: input.title,
      slug: input.slug,
      illustration: input.illustration ?? null,
      position: nextPosition(_max.position),
    },
  });
  return getDetail(section.id);
}

export async function update(id: string, input: UpdateSectionInput): Promise<AdminTopicDetailDto> {
  await prisma.section.update({ where: { id }, data: definedOnly(input) });
  return getDetail(id);
}

export async function remove(id: string): Promise<void> {
  await prisma.section.delete({ where: { id } });
}

export async function reorder(ids: string[]): Promise<void> {
  const found = await prisma.section.findMany({
    where: { id: { in: ids } },
    select: { courseId: true },
  });
  await assertCompleteReorder(
    ids,
    found.map((row) => ({ parentId: row.courseId })),
    (courseId) => prisma.section.count({ where: { courseId } }),
  );
  await prisma.$transaction(
    ids.map((id, position) => prisma.section.update({ where: { id }, data: { position } })),
  );
}
