import type { Prisma } from "@prisma/client";
import type { AdminCaseStudyDto, CaseStudyDto } from "@assetizers/shared";
import { prisma } from "../../lib/prisma";
import { conflict, notFound } from "../../lib/errors";
import { definedOnly } from "../../lib/validation";
import type { CreateCaseStudyInput, UpdateCaseStudyInput } from "./caseStudies.schema";

const caseStudySelect = {
  id: true,
  title: true,
  content: true,
  resources: { orderBy: { name: "asc" }, select: { id: true, name: true, fileUrl: true } },
  section: {
    select: {
      id: true,
      slug: true,
      title: true,
      course: { select: { id: true, slug: true, title: true, isPublished: true } },
    },
  },
} satisfies Prisma.CaseStudySelect;

export async function getPublished(id: string): Promise<CaseStudyDto> {
  const row = await prisma.caseStudy.findUnique({ where: { id }, select: caseStudySelect });
  if (!row || !row.section.course.isPublished) throw notFound("Case study");

  const { section, ...caseStudy } = row;
  return {
    ...caseStudy,
    category: { slug: section.course.slug, title: section.course.title },
    topic: { slug: section.slug, title: section.title },
  };
}

export async function getForAdmin(id: string): Promise<AdminCaseStudyDto> {
  const row = await prisma.caseStudy.findUnique({ where: { id }, select: caseStudySelect });
  if (!row) throw notFound("Case study");

  const { section, ...caseStudy } = row;
  return {
    ...caseStudy,
    category: { id: section.course.id, title: section.course.title },
    topic: { id: section.id, title: section.title },
  };
}

export async function create(input: CreateCaseStudyInput): Promise<AdminCaseStudyDto> {
  const section = await prisma.section.findUnique({
    where: { id: input.sectionId },
    select: { id: true, caseStudy: { select: { id: true } } },
  });
  if (!section) throw notFound("Topic");
  if (section.caseStudy) throw conflict("This topic already has a case study");

  const caseStudy = await prisma.caseStudy.create({
    data: { sectionId: input.sectionId, title: input.title, content: input.content },
  });
  return getForAdmin(caseStudy.id);
}

export async function update(id: string, input: UpdateCaseStudyInput): Promise<AdminCaseStudyDto> {
  await prisma.caseStudy.update({ where: { id }, data: definedOnly(input) });
  return getForAdmin(id);
}

export async function remove(id: string): Promise<void> {
  await prisma.caseStudy.delete({ where: { id } });
}
