# 📚 Assetizers — Free Accounting Course Platform (Monorepo)

A monorepo web app for **Assetizers**, a free online accounting course. Learners use it **without an account**: they browse courses, read lessons, watch videos, and take activities (quizzes) that instantly show which answers are correct. Only **admins** log in, to manage content and upload files such as videos.

---

## 1. Key Decisions

- **No learner accounts.** Everything learner-facing is public. No signup, no login, no enrollment.
- **No tracking or recording.** The system does not save progress, scores, or quiz attempts. Nothing about a learner's answers is stored.
- **Admin-only login (JWT).** Required only for creating/editing content and uploading files.
- **Videos and files are not stored in the database.** They go to external file storage; the database stores only the URL.
- **Page layouts are provided separately** (given to Cursor per page). This document does not define page designs.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite + TypeScript) |
| API | Node.js + Express (TypeScript) |
| ORM | Prisma |
| Database | Neon (serverless PostgreSQL) |
| Auth | JWT, admin only |
| File storage | Cloudinary (recommended for video streaming); Cloudflare R2 / S3 also work |
| Monorepo | npm/pnpm workspaces |

---

## 3. Folder Structure

```
assetizers/
├── apps/
│   ├── frontend/                    # React app
│   │   ├── src/
│   │   │   ├── components/          # Button, Card, Modal, VideoPlayer, Accordion
│   │   │   ├── features/
│   │   │   │   ├── courses/         # course list, course detail, syllabus
│   │   │   │   ├── lessons/         # lesson viewer (text, video, resources)
│   │   │   │   ├── activities/      # quiz runner + answer feedback (no saving)
│   │   │   │   └── admin/           # login, content management, file upload
│   │   │   ├── layouts/             # PublicLayout, AdminLayout
│   │   │   ├── pages/               # public pages + /admin pages
│   │   │   ├── hooks/
│   │   │   ├── lib/                 # api client, admin token handling
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                         # Express backend
│       ├── src/
│       │   ├── config/              # env validation
│       │   ├── lib/                 # prisma client singleton, jwt helpers, storage client
│       │   ├── modules/
│       │   │   ├── auth/            # admin login only
│       │   │   ├── courses/
│       │   │   ├── sections/
│       │   │   ├── lessons/
│       │   │   ├── activities/      # quizzes + stateless answer checking
│       │   │   └── uploads/         # signed upload / file handling (admin)
│       │   ├── middlewares/         # requireAdmin, validate, errorHandler
│       │   ├── app.ts
│       │   └── server.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts              # seeds the first admin + sample course
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                        # optional shared types/config
├── .cursor/rules/project-rules.mdc
├── .env.example
├── package.json                     # workspace root
└── PROJECT.md
```

---

## 4. Features

**Learner (public, no login)**
- Browse the course catalog and syllabus
- Read lessons: written content, embedded video, downloadable resources
- Take activities (quizzes) per section
- After submitting, see which answers are correct or wrong, with explanations
- Retake an activity as many times as they like; nothing is saved

**Admin (login required)**
- Log in with email and password
- Create, edit, delete, reorder courses, sections, and lessons
- Create and edit activities (questions, options, correct answer, explanation)
- **Upload videos and files** for lessons
- Publish / unpublish content

**Suggested accounting curriculum (seed data)**
1. Introduction to Accounting & the Accounting Equation
2. Double-Entry Bookkeeping, Debits & Credits
3. Journal Entries & the General Ledger
4. Trial Balance & Adjusting Entries
5. Financial Statements (Income Statement, Balance Sheet, Cash Flow)
6. Assets: Current, Fixed, Depreciation
7. Liabilities & Equity
8. Basic Financial Analysis & Ratios

---

## 5. Database (Prisma + Neon)

### 5.1 Neon setup
1. Create a project at [neon.tech](https://neon.tech).
2. Copy both connection strings (both need `sslmode=require`):
   - **Pooled** (host contains `-pooler`) → `DATABASE_URL`, used by the app at runtime
   - **Direct** → `DIRECT_URL`, used by Prisma Migrate
3. Use a separate Neon branch for development vs. production.

### 5.2 `apps/api/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Admins only. There are no learner accounts.
model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model Course {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String
  thumbnail   String?
  isPublished Boolean   @default(false)
  sections    Section[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Section {
  id        String    @id @default(cuid())
  title     String
  position  Int
  courseId  String
  course    Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons   Lesson[]
  activity  Activity?

  @@index([courseId, position])
}

model Lesson {
  id        String       @id @default(cuid())
  title     String
  content   String       // markdown / rich text
  videoUrl  String?      // URL from file storage, never the file itself
  position  Int
  sectionId String
  section   Section      @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  resources Resource[]

  @@index([sectionId, position])
}

// Downloadable files attached to a lesson (PDFs, spreadsheets, etc.)
model Resource {
  id       String @id @default(cuid())
  name     String
  fileUrl  String
  lessonId String
  lesson   Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
}

model Activity {
  id        String     @id @default(cuid())
  title     String
  sectionId String     @unique
  section   Section    @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  questions Question[]
}

model Question {
  id          String   @id @default(cuid())
  prompt      String
  options     String[]
  correctIdx  Int
  explanation String?
  position    Int
  activityId  String
  activity    Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)
}
```

> There are intentionally **no** tables for learners, enrollments, progress, or quiz attempts.
> Never put `correctIdx` in any public response that delivers questions.

---

## 6. File & Video Uploads

- Only authenticated admins can upload.
- Files go to external storage (Cloudinary recommended; R2/S3 are fine). The database stores only the resulting URL (`Lesson.videoUrl`, `Resource.fileUrl`).
- Preferred flow: the API issues a **signed upload** (or presigned URL) to the admin's browser, the browser uploads the file directly to storage, then saves the returned URL on the lesson. This keeps large videos off the Express server.
- Validate file type and size limits on the API when issuing the signature.

---

## 7. API Endpoints

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/courses` | Public | List published courses |
| GET | `/api/courses/:slug` | Public | Course detail with sections and lessons |
| GET | `/api/lessons/:id` | Public | Lesson content, video URL, resources |
| GET | `/api/activities/:id` | Public | Questions and options (**no answers**) |
| POST | `/api/activities/:id/check` | Public | Send answers, get back per-question correct/wrong + explanation. **Stateless: nothing is saved.** |
| POST | `/api/auth/login` | Public | Admin login, returns JWT |
| GET | `/api/auth/me` | Admin | Verify current admin |
| POST/PATCH/DELETE | `/api/admin/courses…` | Admin | Manage courses |
| POST/PATCH/DELETE | `/api/admin/sections…` | Admin | Manage sections |
| POST/PATCH/DELETE | `/api/admin/lessons…` | Admin | Manage lessons and resources |
| POST/PATCH/DELETE | `/api/admin/activities…` | Admin | Manage activities and questions |
| POST | `/api/admin/uploads/sign` | Admin | Get a signed upload for a video or file |

Public routes return only **published** content.

---

## 8. Page Layouts

Page layouts are **provided per page** (given directly to Cursor). Implement each page exactly as its supplied layout; do not invent or restyle layouts.

Typical pages to expect:
- Public: Home, Course list, Course detail, Lesson, Activity
- Admin: Login, Dashboard, Course/Section/Lesson editor, Activity editor, Upload

Every data view needs loading, empty, and error states.

---

## 9. Getting Started

```bash
npm install
cp .env.example .env            # add Neon strings, JWT secret, storage keys

cd apps/api
npx prisma migrate dev --name init
npx prisma db seed              # creates first admin + sample course
cd ../..

npm run dev:api                 # http://localhost:4000
npm run dev:frontend            # http://localhost:5173
```

## 10. Environment Variables (`.env.example`)

```env
# API
PORT=4000
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
CLIENT_URL=http://localhost:5173
JWT_SECRET=change_me
JWT_EXPIRES_IN=1d

# Seeded admin (used by prisma seed only)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change_me

# File storage (Cloudinary example)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend
VITE_API_BASE_URL=http://localhost:4000
```

## 11. Root `package.json`

```json
{
  "name": "assetizers",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:api": "npm run dev --workspace=apps/api",
    "dev:frontend": "npm run dev --workspace=apps/frontend",
    "db:migrate": "npm run prisma:migrate --workspace=apps/api",
    "db:seed": "npm run prisma:seed --workspace=apps/api"
  }
}
```

## 12. Notes
- Content is educational; add a short disclaimer that it is not professional accounting or tax advice.
- Never commit `.env`; keep Neon credentials, JWT secret, and storage keys in env files or your host's secrets only.
- Because answers are never stored, there is no learner personal data to protect. Admin credentials are the only sensitive data.
