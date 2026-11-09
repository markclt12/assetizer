import type { Prisma } from "@prisma/client";
import type {
  AdminCategoryDetailDto,
  AdminCategoryDto,
  CategoryDetailDto,
  CategorySummaryDto,
  TopicDetailDto,
  TopicSummaryDto,
} from "@assetizers/shared";
import { prisma } from "../../lib/prisma";
import { badRequest, notFound } from "../../lib/errors";
import { nextPosition } from "../../lib/ordering";
import { definedOnly } from "../../lib/validation";
import type { CreateCourseInput, UpdateCourseInput } from "./courses.schema";

const courseOrder = [{ position: "asc" }, { createdAt: "asc" }] satisfies Prisma.CourseOrderByWithRelationInput[];

const topicSummarySelect = {
  id: true,
  slug: true,
  title: true,
  illustration: true,
  position: true,
  _count: { select: { lessons: true } },
  activity: { select: { id: true } },
  caseStudy: { select: { id: true } },
} satisfies Prisma.SectionSelect;

type TopicSummaryRow = Prisma.SectionGetPayload<{ select: typeof topicSummarySelect }>;

const toTopicSummary = (row: TopicSummaryRow): TopicSummaryDto => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  illustration: row.illustration,
  position: row.position,
  lessonCount: row._count.lessons,
  activityId: row.activity?.id ?? null,
  caseStudyId: row.caseStudy?.id ?? null,
});

const courseSummarySelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  thumbnail: true,
  isPublished: true,
  position: true,
  _count: { select: { sections: true } },
} satisfies Prisma.CourseSelect;

type CourseSummaryRow = Prisma.CourseGetPayload<{ select: typeof courseSummarySelect }>;

const toCategorySummary = (row: CourseSummaryRow): CategorySummaryDto => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  description: row.description,
  thumbnail: row.thumbnail,
  topicCount: row._count.sections,
});

const toAdminCategory = (row: CourseSummaryRow): AdminCategoryDto => ({
  ...toCategorySummary(row),
  isPublished: row.isPublished,
  position: row.position,
});

/* --------------------------------- Public --------------------------------- */

export async function listPublished(): Promise<CategorySummaryDto[]> {
  const rows = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: courseOrder,
    select: courseSummarySelect,
  });
  return rows.map(toCategorySummary);
}

export async function getPublishedBySlug(slug: string): Promise<CategoryDetailDto> {
  const row = await prisma.course.findFirst({
    where: { slug, isPublished: true },
    select: {
      ...courseSummarySelect,
      sections: { orderBy: { position: "asc" }, select: topicSummarySelect },
    },
  });
  if (!row) throw notFound("Category");
  return { ...toCategorySummary(row), topics: row.sections.map(toTopicSummary) };
}

export async function getPublishedTopic(courseSlug: string, topicSlug: string): Promise<TopicDetailDto> {
  const row = await prisma.section.findFirst({
    where: { slug: topicSlug, course: { slug: courseSlug, isPublished: true } },
    select: {
      id: true,
      slug: true,
      title: true,
      illustration: true,
      course: { select: { slug: true, title: true } },
      lessons: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          content: true,
          videoUrl: true,
          position: true,
          resources: { orderBy: { name: "asc" }, select: { id: true, name: true, fileUrl: true } },
        },
      },
      activity: { select: { id: true, title: true, _count: { select: { questions: true } } } },
      caseStudy: { select: { id: true, title: true } },
    },
  });
  if (!row) throw notFound("Topic");

  return {
    category: row.course,
    topic: { id: row.id, slug: row.slug, title: row.title, illustration: row.illustration },
    lessons: row.lessons,
    activity: row.activity
      ? { id: row.activity.id, title: row.activity.title, questionCount: row.activity._count.questions }
      : null,
    caseStudy: row.caseStudy,
  };
}

/* ---------------------------------- Admin --------------------------------- */

export async function listAll(): Promise<AdminCategoryDto[]> {
  const rows = await prisma.course.findMany({ orderBy: courseOrder, select: courseSummarySelect });
  return rows.map(toAdminCategory);
}

export async function getDetail(id: string): Promise<AdminCategoryDetailDto> {
  const row = await prisma.course.findUnique({
    where: { id },
    select: {
      ...courseSummarySelect,
      sections: { orderBy: { position: "asc" }, select: topicSummarySelect },
    },
  });
  if (!row) throw notFound("Category");
  return { ...toAdminCategory(row), topics: row.sections.map(toTopicSummary) };
}

export async function create(input: CreateCourseInput): Promise<AdminCategoryDetailDto> {
  const { _max } = await prisma.course.aggregate({ _max: { position: true } });
  const course = await prisma.course.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      thumbnail: input.thumbnail ?? null,
      isPublished: input.isPublished,
      position: nextPosition(_max.position),
    },
  });
  return getDetail(course.id);
}

export async function update(id: string, input: UpdateCourseInput): Promise<AdminCategoryDetailDto> {
  await prisma.course.update({ where: { id }, data: definedOnly(input) });
  return getDetail(id);
}

export async function remove(id: string): Promise<void> {
  await prisma.course.delete({ where: { id } });
}

export async function reorder(ids: string[]): Promise<AdminCategoryDto[]> {
  if (new Set(ids).size !== ids.length) throw badRequest("Duplicate ids in reorder request");
  const total = await prisma.course.count();
  const found = await prisma.course.count({ where: { id: { in: ids } } });
  if (found !== ids.length || total !== ids.length) {
    throw badRequest("Reorder must include every category exactly once");
  }
  await prisma.$transaction(
    ids.map((id, position) => prisma.course.update({ where: { id }, data: { position } })),
  );
  return listAll();
}
