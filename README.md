# ASSETizers

A free online accounting course about assets, served with a food theme: *Making Assets Concept, easy to Digest*.

Learners use it **without an account**. They browse lessons, watch videos, and take quizzes that show right away which answers are correct. Nothing about learners is stored. Only **admins** log in, to manage content and upload files.

The product spec is [docs/PROJECT-Thesis.md](docs/PROJECT-Thesis.md).

## Features

**Learners (public, no login).** The site has three areas, each split into **Current** and **Non-current ASSETizers**:

| Area | What it serves | Route |
|---|---|---|
| Main Course | Lessons: written content, video, downloadable resources | `/main-course/:category/:topic` |
| Practice Bites | Quizzes with per-question feedback. Retake any time; nothing is saved | `/practice-bites/:category/:topic` |
| Specials | Case studies | `/specials/:category/:topic` |

**Admins (`/admin`, JWT login):**
- Create, edit, delete, reorder and publish categories and topics.
- Edit lessons, quizzes and case studies.
- Upload videos, images and files straight to storage.

**How the data model maps to the site:**
- A `Course` is a **category** (`current`, `non-current`).
- A `Section` is a **topic**, such as CASHew.
- A topic powers all three areas through its `Lesson`s, its `Activity`, and its `CaseStudy`.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, Radix UI primitives, TanStack Query, React Router |
| API | Node.js, Express 5, TypeScript, Zod |
| Database | Prisma 6 + Neon (serverless PostgreSQL) |
| Auth | JWT (admins only) |
| File storage | Cloudinary **or** any S3-compatible bucket (signed direct uploads) |
| Monorepo | npm workspaces |

## Folder structure

```
apps/
  api/                Express API
    prisma/           schema.prisma, migrations/, seed.ts, seed-data.ts
    src/
      config/         validated env
      lib/            prisma client, jwt, storage, errors, helpers
      middlewares/    requireAdmin, validate, errorHandler
      modules/        auth, courses, sections, lessons, resources,
                      activities, caseStudies, uploads
                      (each: routes, controller, service, schema)
  frontend/           React app
    public/illustrations/   decorative food art for the topic "element" panel
    src/
      components/     shared UI (Button, Card, Modal, Accordion, VideoPlayer, ...)
      features/       courses, activities, admin
      layouts/        PublicLayout, AdminLayout, PageFrame
      pages/          public pages + pages/admin
      lib/            API client, admin token, area/category config
      styles/         theme.css (palette tokens), global.css
packages/
  shared/             request/response types shared by both apps
```

## Theme

All colors come from the sushi palette, defined as CSS variables in [apps/frontend/src/styles/theme.css](apps/frontend/src/styles/theme.css).

**Area accents:**
- Main Course: sage
- Practice Bites: orange
- Specials: salmon

**Category accents:**
- Current: red
- Non-current: yellow

The landing-page `Logo` and `Wordmark` components are placeholders. Swap in the final logo and typography there.

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env     # fill in Neon URLs, JWT secret, admin seed creds, storage keys

npm run db:migrate       # apply migrations (prisma migrate dev)
npm run db:seed          # first admin + Current/Non-current sample content

npm run dev              # API on http://localhost:4000 and web on http://localhost:5173
```

In development, Vite proxies `/api` to the API, so `VITE_API_BASE_URL` can stay empty.

The seed is safe to re-run:
- The admin's password is reset to `SEED_ADMIN_PASSWORD`.
- Categories that already exist are left untouched.

### Root scripts

| Script | What it does |
|---|---|
| `npm run dev` | Runs API and frontend together |
| `npm run dev:api` / `npm run dev:frontend` | Runs one app |
| `npm run db:migrate` | `prisma migrate dev` (create/apply migrations) |
| `npm run db:deploy` | `prisma migrate deploy` (production) |
| `npm run db:seed` | Seeds admin + sample content |
| `npm run db:studio` | Opens Prisma Studio |
| `npm run build` | Builds all workspaces |
| `npm run typecheck` | Typechecks all workspaces |

### File uploads

Admins upload files from the browser **directly to storage**. The API only validates the type and size and returns a signature; the database stores only the resulting URL.

**Cloudinary.** Set the three `CLOUDINARY_*` variables.

**S3-compatible storage (AWS S3, Cloudflare R2, Tigris, ...).** Set the `AWS_*` variables and `S3_BUCKET`, then:
- Allow `PUT` from your site's origin in the bucket's CORS settings so browsers can upload.
- If the bucket is public, set `S3_PUBLIC_BASE_URL`.
- Otherwise, files are served through `GET /api/files/*`, which redirects to a short-lived signed URL.

If both providers are configured, Cloudinary is used.

| Kind | Allowed types | Max size |
|---|---|---|
| `video` | mp4, webm, mov | 500 MB |
| `image` | png, jpeg, webp, gif, svg | 10 MB |
| `file` | pdf, csv, txt, xls(x), doc(x), ppt(x) | 50 MB |

## Environment variables

All variables live in a single `.env` at the repository root. See [.env.example](.env.example).

| Variable | Required | Description |
|---|---|---|
| `PORT` | no | API port (default `4000`) |
| `API_PUBLIC_URL` | no | Public URL of the API, used to build file-proxy URLs (default `http://localhost:PORT`) |
| `CLIENT_URL` | no | Allowed CORS origin(s), comma-separated (default `http://localhost:5173`) |
| `JWT_SECRET` | prod | Secret for admin JWTs. Required in production; dev falls back to an insecure value |
| `JWT_EXPIRES_IN` | no | Token lifetime (default `1d`) |
| `DATABASE_URL` | yes | Direct Neon connection string (used by Prisma Migrate) |
| `DATABASE_URL_POOLED` | no | Pooled Neon connection string (`-pooler` host), preferred at runtime |
| `SEED_ADMIN_EMAIL` | seed | Email of the admin created by `db:seed` |
| `SEED_ADMIN_PASSWORD` | seed | Password of the admin created by `db:seed` |
| `CLOUDINARY_CLOUD_NAME` | storage | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | storage | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | storage | Cloudinary API secret |
| `AWS_ENDPOINT_URL_S3` | storage | S3-compatible endpoint (omit for AWS S3) |
| `AWS_ACCESS_KEY_ID` | storage | S3 access key |
| `AWS_SECRET_ACCESS_KEY` | storage | S3 secret key |
| `AWS_REGION` | no | S3 region (default `auto`) |
| `S3_BUCKET` | storage | Bucket name |
| `S3_PUBLIC_BASE_URL` | no | Public base URL for the bucket; if empty, files go through `/api/files/*` |
| `VITE_API_BASE_URL` | no | API origin for the frontend build; leave empty to use same-origin `/api` |

Never commit `.env`.

## API Reference

The full route list, request bodies, and response shapes are in [docs/API.md](docs/API.md).

---

ASSETizers is educational content only and is not professional accounting, tax, or financial advice.
