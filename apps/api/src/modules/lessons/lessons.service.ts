import type { Prisma } from "@prisma/client";
import type { AdminLessonDto, LessonDetailDto } from "@assetizers/shared";
import { prisma } from "../../lib/prisma";
import { notFound } from "../../lib/errors";
import { assertCompleteReorder, nextPosition } from "../../lib/ordering";
import { definedOnly } from "../../lib/validation";
import type { CreateLessonInput, UpdateLessonInput } from "./lessons.schema";

const lessonSelect = {
  id: true,
  title: true,
  content: true,
  videoUrl: true,
  position: true,
  resources: { orderBy: { name: "asc" }, select: { id: true, name: true, fileUrl: true } },
  section: {
    select: {
      id: true,
      slug: true,
      title: true,
      course: { select: { id: true, slug: true, title: true, isPublished: true } },
    },
  },
} satisfies Prisma.LessonSelect;

export async function getPublished(id: string): Promise<LessonDetailDto> {
  const row = await prisma.lesson.findUnique({ where: { id }, select: lessonSelect });
  if (!row || !row.section.course.isPublished) throw notFound("Lesson");

  const { section, ...lesson } = row;
  return {
    ...lesson,
    category: { slug: section.course.slug, title: section.course.title },
    topic: { slug: section.slug, title: section.title },
  };
}

export async function getForAdmin(id: string): Promise<AdminLessonDto> {
  const row = await prisma.lesson.findUnique({ where: { id }, select: lessonSelect });
  if (!row) throw notFound("Lesson");

  const { section, ...lesson } = row;
  return {
    ...lesson,
    category: { id: section.course.id, title: section.course.title },
    topic: { id: section.id, title: section.title },
  };
}

export async function create(input: CreateLessonInput): Promise<AdminLessonDto> {
  const section = await prisma.section.findUnique({ where: { id: input.sectionId }, select: { id: true } });
  if (!section) throw notFound("Topic");

  const { _max } = await prisma.lesson.aggregate({
    where: { sectionId: input.sectionId },
    _max: { position: true },
  });
  const lesson = await prisma.lesson.create({
    data: {
      sectionId: input.sectionId,
      title: input.title,
      content: input.content,
      videoUrl: input.videoUrl ?? null,
      position: nextPosition(_max.position),
    },
  });
  return getForAdmin(lesson.id);
}

export async function update(id: string, input: UpdateLessonInput): Promise<AdminLessonDto> {
  await prisma.lesson.update({ where: { id }, data: definedOnly(input) });
  return getForAdmin(id);
}

export async function remove(id: string): Promise<void> {
  await prisma.lesson.delete({ where: { id } });
}

export async function reorder(ids: string[]): Promise<void> {
  const found = await prisma.lesson.findMany({ where: { id: { in: ids } }, select: { sectionId: true } });
  await assertCompleteReorder(
    ids,
    found.map((row) => ({ parentId: row.sectionId })),
    (sectionId) => prisma.lesson.count({ where: { sectionId } }),
  );
  await prisma.$transaction(
    ids.map((id, position) => prisma.lesson.update({ where: { id }, data: { position } })),
  );
}
