import { useQuery } from "@tanstack/react-query";
import type {
  CaseStudyDto,
  CategoryDetailDto,
  CategorySummaryDto,
  TopicDetailDto,
} from "@assetizers/shared";
import { api } from "../../lib/api";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<CategorySummaryDto[]>("/api/courses"),
  });

export const useCategory = (slug: string) =>
  useQuery({
    queryKey: ["category", slug],
    queryFn: () => api.get<CategoryDetailDto>(`/api/courses/${encodeURIComponent(slug)}`),
  });

export const useTopic = (categorySlug: string, topicSlug: string) =>
  useQuery({
    queryKey: ["topic", categorySlug, topicSlug],
    queryFn: () =>
      api.get<TopicDetailDto>(
        `/api/courses/${encodeURIComponent(categorySlug)}/topics/${encodeURIComponent(topicSlug)}`,
      ),
  });

export const useCaseStudy = (id: string | undefined) =>
  useQuery({
    queryKey: ["caseStudy", id],
    queryFn: () => api.get<CaseStudyDto>(`/api/case-studies/${id}`),
    enabled: Boolean(id),
  });
