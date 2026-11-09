import type { ResourceDto } from "@assetizers/shared";
import { prisma } from "../../lib/prisma";
import { notFound } from "../../lib/errors";
import { definedOnly } from "../../lib/validation";
import type { CreateResourceInput, UpdateResourceInput } from "./resources.schema";

const resourceSelect = { id: true, name: true, fileUrl: true } as const;

export async function create(input: CreateResourceInput): Promise<ResourceDto> {
  if (input.lessonId) {
    const lesson = await prisma.lesson.findUnique({ where: { id: input.lessonId }, select: { id: true } });
    if (!lesson) throw notFound("Lesson");
  }
  if (input.caseStudyId) {
    const caseStudy = await prisma.caseStudy.findUnique({
      where: { id: input.caseStudyId },
      select: { id: true },
    });
    if (!caseStudy) throw notFound("Case study");
  }

  return prisma.resource.create({
    data: {
      name: input.name,
      fileUrl: input.fileUrl,
      lessonId: input.lessonId ?? null,
      caseStudyId: input.caseStudyId ?? null,
    },
    select: resourceSelect,
  });
}

export async function update(id: string, input: UpdateResourceInput): Promise<ResourceDto> {
  return prisma.resource.update({ where: { id }, data: definedOnly(input), select: resourceSelect });
}

export async function remove(id: string): Promise<void> {
  await prisma.resource.delete({ where: { id } });
}
