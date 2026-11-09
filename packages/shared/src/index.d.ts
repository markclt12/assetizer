// Shared request/response shapes for the Assetizers API.
// Type-only: both apps import these with `import type`.

export interface ApiErrorBody {
  error: { message: string; code: string; details?: unknown };
}

/* ---------------------------------- Public --------------------------------- */

export interface ResourceDto {
  id: string;
  name: string;
  fileUrl: string;
}

export interface CategorySummaryDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  topicCount: number;
}

export interface TopicSummaryDto {
  id: string;
  slug: string;
  title: string;
  illustration: string | null;
  position: number;
  lessonCount: number;
  activityId: string | null;
  caseStudyId: string | null;
}

export interface CategoryDetailDto extends CategorySummaryDto {
  topics: TopicSummaryDto[];
}

export interface CategoryRefDto {
  slug: string;
  title: string;
}

export interface TopicRefDto {
  slug: string;
  title: string;
}

export interface LessonDto {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  position: number;
  resources: ResourceDto[];
}

export interface TopicDetailDto {
  category: CategoryRefDto;
  topic: {
    id: string;
    slug: string;
    title: string;
    illustration: string | null;
  };
  lessons: LessonDto[];
  activity: { id: string; title: string; questionCount: number } | null;
  caseStudy: { id: string; title: string } | null;
}

export interface LessonDetailDto extends LessonDto {
  category: CategoryRefDto;
  topic: TopicRefDto;
}

export interface PublicQuestionDto {
  id: string;
  prompt: string;
  options: string[];
  position: number;
}

export interface PublicActivityDto {
  id: string;
  title: string;
  category: CategoryRefDto;
  topic: TopicRefDto;
  questions: PublicQuestionDto[];
}

export interface CheckAnswersRequest {
  answers: { questionId: string; selectedIdx: number | null }[];
}

export interface CheckResultItem {
  questionId: string;
  selectedIdx: number | null;
  correct: boolean;
  correctIdx: number;
  explanation: string | null;
}

export interface CheckAnswersResponse {
  results: CheckResultItem[];
  score: number;
  total: number;
}

export interface CaseStudyDto {
  id: string;
  title: string;
  content: string;
  category: CategoryRefDto;
  topic: TopicRefDto;
  resources: ResourceDto[];
}

/* ---------------------------------- Auth ---------------------------------- */

export interface AdminDto {
  id: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminDto;
}

/* ---------------------------------- Admin --------------------------------- */

export interface AdminCategoryDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  isPublished: boolean;
  position: number;
  topicCount: number;
}

export interface AdminTopicSummaryDto {
  id: string;
  slug: string;
  title: string;
  illustration: string | null;
  position: number;
  lessonCount: number;
  activityId: string | null;
  caseStudyId: string | null;
}

export interface AdminCategoryDetailDto extends AdminCategoryDto {
  topics: AdminTopicSummaryDto[];
}

export interface AdminLessonSummaryDto {
  id: string;
  title: string;
  position: number;
  hasVideo: boolean;
  resourceCount: number;
}

export interface AdminTopicDetailDto {
  id: string;
  slug: string;
  title: string;
  illustration: string | null;
  position: number;
  category: { id: string; slug: string; title: string };
  lessons: AdminLessonSummaryDto[];
  activity: { id: string; title: string; questionCount: number } | null;
  caseStudy: { id: string; title: string } | null;
}

export interface AdminParentRefDto {
  category: { id: string; title: string };
  topic: { id: string; title: string };
}

export interface AdminLessonDto extends AdminParentRefDto {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  position: number;
  resources: ResourceDto[];
}

export interface AdminQuestionDto {
  id: string;
  prompt: string;
  options: string[];
  correctIdx: number;
  explanation: string | null;
  position: number;
}

export interface AdminActivityDto extends AdminParentRefDto {
  id: string;
  title: string;
  questions: AdminQuestionDto[];
}

export interface AdminCaseStudyDto extends AdminParentRefDto {
  id: string;
  title: string;
  content: string;
  resources: ResourceDto[];
}

export interface ReorderRequest {
  ids: string[];
}

/* --------------------------------- Uploads -------------------------------- */

export type UploadKind = "video" | "image" | "file";

export interface SignUploadRequest {
  kind: UploadKind;
  fileName: string;
  mimeType: string;
  size: number;
}

export type SignUploadResponse =
  | {
      provider: "cloudinary";
      method: "POST";
      uploadUrl: string;
      fields: Record<string, string>;
    }
  | {
      provider: "s3";
      method: "PUT";
      uploadUrl: string;
      headers: Record<string, string>;
      fileUrl: string;
    };
