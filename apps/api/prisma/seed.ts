import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./seed-data";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set; skipping admin seed.");
    return;
  }
  if (password === "change_me" && process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed the default admin password in production.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`Admin ready: ${email}`);
}

async function seedContent() {
  for (const [categoryIndex, category] of seedCategories.entries()) {
    const existing = await prisma.course.findUnique({ where: { slug: category.slug } });
    if (existing) {
      console.log(`Category "${category.slug}" already exists; leaving its content untouched.`);
      continue;
    }

    await prisma.course.create({
      data: {
        slug: category.slug,
        title: category.title,
        description: category.description,
        isPublished: true,
        position: categoryIndex,
        sections: {
          create: category.topics.map((topic, topicIndex) => ({
            slug: topic.slug,
            title: topic.title,
            illustration: topic.illustration,
            position: topicIndex,
            lessons: {
              create: [{ title: topic.lesson.title, content: topic.lesson.content, position: 0 }],
            },
            activity: {
              create: {
                title: topic.activity.title,
                questions: {
                  create: topic.activity.questions.map((question, questionIndex) => ({
                    ...question,
                    position: questionIndex,
                  })),
                },
              },
            },
            caseStudy: {
              create: { title: topic.caseStudy.title, content: topic.caseStudy.content },
            },
          })),
        },
      },
    });
    console.log(`Seeded category "${category.slug}" with ${category.topics.length} topics.`);
  }
}

async function main() {
  await seedAdmin();
  await seedContent();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
