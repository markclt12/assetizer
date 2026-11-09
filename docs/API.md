# API Reference

Every error response has this shape:

```json
{ "error": { "message": "string", "code": "string" } }
```

Validation errors also include `details` with Zod's `fieldErrors`.

Every Admin route needs `Authorization: Bearer <token>`. Without a valid token, it returns `401`.

Public routes only return content from **published** categories.

## Health

### GET /api/health
Access: Public
200: { "status": "ok" }
Errors: none

## Auth

### POST /api/auth/login
Access: Public
Body: { "email": "string", "password": "string" }
200: { "token": "string", "admin": { "id": "string", "email": "string" } }
Errors: 400 invalid body, 401 invalid email or password

### GET /api/auth/me
Access: Admin
200: { "admin": { "id": "string", "email": "string" } }
Errors: 401 missing/invalid token or admin no longer exists

## Public content

### GET /api/courses
Access: Public
200: [{ "id": "string", "slug": "string", "title": "string", "description": "string", "thumbnail": "string|null", "topicCount": 0 }]
Errors: none

### GET /api/courses/:slug
Access: Public
200: { ...category, "topics": [{ "id": "string", "slug": "string", "title": "string", "illustration": "string|null", "position": 0, "lessonCount": 0, "activityId": "string|null", "caseStudyId": "string|null" }] }
Errors: 404 category not found or unpublished

### GET /api/courses/:slug/topics/:topicSlug
Access: Public
200: { "category": { "slug": "string", "title": "string" }, "topic": { "id": "string", "slug": "string", "title": "string", "illustration": "string|null" }, "lessons": [{ "id": "string", "title": "string", "content": "markdown", "videoUrl": "string|null", "position": 0, "resources": [{ "id": "string", "name": "string", "fileUrl": "string" }] }], "activity": { "id": "string", "title": "string", "questionCount": 0 } | null, "caseStudy": { "id": "string", "title": "string" } | null }
Errors: 404 topic not found or category unpublished

### GET /api/lessons/:id
Access: Public
200: { "id": "string", "title": "string", "content": "markdown", "videoUrl": "string|null", "position": 0, "resources": [...], "category": { "slug": "string", "title": "string" }, "topic": { "slug": "string", "title": "string" } }
Errors: 404 lesson not found or category unpublished

### GET /api/activities/:id
Access: Public
200: { "id": "string", "title": "string", "category": { "slug", "title" }, "topic": { "slug", "title" }, "questions": [{ "id": "string", "prompt": "string", "options": ["string"], "position": 0 }] }
Errors: 404 activity not found or category unpublished
Note: never includes answers (`correctIdx`) or explanations.

### POST /api/activities/:id/check
Access: Public
Body: { "answers": [{ "questionId": "string", "selectedIdx": 0 }] } (`selectedIdx` may be `null` for unanswered)
200: { "results": [{ "questionId": "string", "selectedIdx": 0, "correct": true, "correctIdx": 0, "explanation": "string|null" }], "score": 0, "total": 0 }
Errors: 400 invalid body or question not in this activity, 404 activity not found
Note: stateless. Nothing is saved.

### GET /api/case-studies/:id
Access: Public
200: { "id": "string", "title": "string", "content": "markdown", "resources": [...], "category": { "slug", "title" }, "topic": { "slug", "title" } }
Errors: 404 case study not found or category unpublished

### GET /api/files/*key
Access: Public
302: redirect to a short-lived signed download URL (private S3 buckets only; key must start with `videos/`, `images/` or `files/`)
Errors: 400 invalid path, 404 S3 storage not configured

## Admin: categories

### GET /api/admin/courses
Access: Admin
200: [{ "id", "slug", "title", "description", "thumbnail", "isPublished": true, "position": 0, "topicCount": 0 }]
Errors: 401

### POST /api/admin/courses
Access: Admin
Body: { "title": "string", "slug": "string", "description": "string?", "thumbnail": "string|null?", "isPublished": false }
201: category detail (as GET /api/admin/courses/:id)
Errors: 400 invalid body, 401, 409 slug already exists

### PATCH /api/admin/courses/reorder
Access: Admin
Body: { "ids": ["string"] } (every category, in the new order)
200: category list (as GET /api/admin/courses)
Errors: 400 missing/duplicate/unknown ids, 401

### GET /api/admin/courses/:id
Access: Admin
200: { ...admin category, "topics": [topic summary] }
Errors: 401, 404 category not found

### PATCH /api/admin/courses/:id
Access: Admin
Body: { "title"?, "slug"?, "description"?, "thumbnail"?, "isPublished"? }
200: category detail
Errors: 400 invalid body, 401, 404 not found, 409 slug already exists

### DELETE /api/admin/courses/:id
Access: Admin
204: no content (cascades to topics, lessons, activities, case studies)
Errors: 401, 404 not found

## Admin: topics (sections)

### POST /api/admin/sections
Access: Admin
Body: { "courseId": "string", "title": "string", "slug": "string", "illustration": "string|null?" }
201: topic detail (as GET /api/admin/sections/:id)
Errors: 400 invalid body, 401, 404 category not found, 409 slug already used in this category

### PATCH /api/admin/sections/reorder
Access: Admin
Body: { "ids": ["string"] } (every topic of one category, in the new order)
204: no content
Errors: 400 missing/duplicate ids or mixed categories, 401

### GET /api/admin/sections/:id
Access: Admin
200: { "id", "slug", "title", "illustration", "position", "category": { "id", "slug", "title" }, "lessons": [{ "id", "title", "position", "hasVideo", "resourceCount" }], "activity": { "id", "title", "questionCount" } | null, "caseStudy": { "id", "title" } | null }
Errors: 401, 404 topic not found

### PATCH /api/admin/sections/:id
Access: Admin
Body: { "title"?, "slug"?, "illustration"? }
200: topic detail
Errors: 400 invalid body, 401, 404 not found, 409 slug already used

### DELETE /api/admin/sections/:id
Access: Admin
204: no content (cascades to lessons, activity, case study)
Errors: 401, 404 not found

## Admin: lessons

### POST /api/admin/lessons
Access: Admin
Body: { "sectionId": "string", "title": "string", "content": "markdown?", "videoUrl": "string|null?" }
201: lesson (as GET /api/admin/lessons/:id)
Errors: 400 invalid body, 401, 404 topic not found

### PATCH /api/admin/lessons/reorder
Access: Admin
Body: { "ids": ["string"] } (every lesson of one topic, in the new order)
204: no content
Errors: 400 missing/duplicate ids or mixed topics, 401

### GET /api/admin/lessons/:id
Access: Admin
200: { "id", "title", "content", "videoUrl", "position", "resources": [...], "category": { "id", "title" }, "topic": { "id", "title" } }
Errors: 401, 404 lesson not found

### PATCH /api/admin/lessons/:id
Access: Admin
Body: { "title"?, "content"?, "videoUrl"? }
200: lesson
Errors: 400 invalid body, 401, 404 not found

### DELETE /api/admin/lessons/:id
Access: Admin
204: no content
Errors: 401, 404 not found

## Admin: resources

### POST /api/admin/resources
Access: Admin
Body: { "name": "string", "fileUrl": "string", "lessonId": "string" } or { "name", "fileUrl", "caseStudyId": "string" }
201: { "id": "string", "name": "string", "fileUrl": "string" }
Errors: 400 invalid body or both/neither parent ids, 401, 404 lesson/case study not found

### PATCH /api/admin/resources/:id
Access: Admin
Body: { "name"?, "fileUrl"? }
200: { "id", "name", "fileUrl" }
Errors: 400 invalid body, 401, 404 not found

### DELETE /api/admin/resources/:id
Access: Admin
204: no content
Errors: 401, 404 not found

## Admin: activities (Practice Bites)

### POST /api/admin/activities
Access: Admin
Body: { "sectionId": "string", "title": "string" }
201: activity (as GET /api/admin/activities/:id)
Errors: 400 invalid body, 401, 404 topic not found, 409 topic already has an activity

### GET /api/admin/activities/:id
Access: Admin
200: { "id", "title", "category": { "id", "title" }, "topic": { "id", "title" }, "questions": [{ "id", "prompt", "options", "correctIdx", "explanation", "position" }] }
Errors: 401, 404 activity not found

### PATCH /api/admin/activities/:id
Access: Admin
Body: { "title": "string" }
200: activity
Errors: 400 invalid body, 401, 404 not found

### DELETE /api/admin/activities/:id
Access: Admin
204: no content (deletes its questions)
Errors: 401, 404 not found

### POST /api/admin/questions
Access: Admin
Body: { "activityId": "string", "prompt": "string", "options": ["string"], "correctIdx": 0, "explanation": "string|null?" } (2-8 options)
201: { "id", "prompt", "options", "correctIdx", "explanation", "position" }
Errors: 400 invalid body or correctIdx out of range, 401, 404 activity not found

### PATCH /api/admin/questions/reorder
Access: Admin
Body: { "ids": ["string"] } (every question of one activity, in the new order)
204: no content
Errors: 400 missing/duplicate ids or mixed activities, 401

### PATCH /api/admin/questions/:id
Access: Admin
Body: { "prompt"?, "options"?, "correctIdx"?, "explanation"? }
200: question
Errors: 400 invalid body or correctIdx out of range, 401, 404 not found

### DELETE /api/admin/questions/:id
Access: Admin
204: no content
Errors: 401, 404 not found

## Admin: case studies (Specials)

### POST /api/admin/case-studies
Access: Admin
Body: { "sectionId": "string", "title": "string", "content": "markdown?" }
201: case study (as GET /api/admin/case-studies/:id)
Errors: 400 invalid body, 401, 404 topic not found, 409 topic already has a case study

### GET /api/admin/case-studies/:id
Access: Admin
200: { "id", "title", "content", "resources": [...], "category": { "id", "title" }, "topic": { "id", "title" } }
Errors: 401, 404 case study not found

### PATCH /api/admin/case-studies/:id
Access: Admin
Body: { "title"?, "content"? }
200: case study
Errors: 400 invalid body, 401, 404 not found

### DELETE /api/admin/case-studies/:id
Access: Admin
204: no content
Errors: 401, 404 not found

## Admin: uploads

### POST /api/admin/uploads/sign
Access: Admin
Body: { "kind": "video" | "image" | "file", "fileName": "string", "mimeType": "string", "size": 0 }
200 (Cloudinary): { "provider": "cloudinary", "method": "POST", "uploadUrl": "string", "fields": { "api_key", "timestamp", "folder", "signature" } }. POST the file as multipart with these fields and read `secure_url`.
200 (S3): { "provider": "s3", "method": "PUT", "uploadUrl": "string", "headers": { "Content-Type": "string" }, "fileUrl": "string" }. PUT the raw file, then save `fileUrl`.
Errors: 400 unsupported type or too large, 401, 503 storage not configured
