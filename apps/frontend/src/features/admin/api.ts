import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminActivityDto,
  AdminCaseStudyDto,
  AdminCategoryDetailDto,
  AdminCategoryDto,
  AdminDto,
  AdminLessonDto,
  AdminTopicDetailDto,
  LoginRequest,
  LoginResponse,
} from "@assetizers/shared";
import { api } from "../../lib/api";
import { clearAdminToken, setAdminToken } from "../../lib/auth";

export const useAdminMe = (enabled = true) =>
  useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => api.get<{ admin: AdminDto }>("/api/auth/me"),
    enabled,
    retry: false,
    staleTime: 5 * 60_000,
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => api.post<LoginResponse>("/api/auth/login", body),
    onSuccess: (data) => {
      setAdminToken(data.token);
      queryClient.setQueryData(["admin", "me"], { admin: data.admin });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return () => {
    clearAdminToken();
    queryClient.removeQueries({ queryKey: ["admin"] });
  };
};

export const useAdminCategories = () =>
  useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => api.get<AdminCategoryDto[]>("/api/admin/courses"),
  });

export const useAdminCategory = (id: string) =>
  useQuery({
    queryKey: ["admin", "category", id],
    queryFn: () => api.get<AdminCategoryDetailDto>(`/api/admin/courses/${id}`),
  });

export const useAdminTopic = (id: string) =>
  useQuery({
    queryKey: ["admin", "topic", id],
    queryFn: () => api.get<AdminTopicDetailDto>(`/api/admin/sections/${id}`),
  });

export const useAdminLesson = (id: string) =>
  useQuery({
    queryKey: ["admin", "lesson", id],
    queryFn: () => api.get<AdminLessonDto>(`/api/admin/lessons/${id}`),
  });

export const useAdminActivity = (id: string) =>
  useQuery({
    queryKey: ["admin", "activity", id],
    queryFn: () => api.get<AdminActivityDto>(`/api/admin/activities/${id}`),
  });

export const useAdminCaseStudy = (id: string) =>
  useQuery({
    queryKey: ["admin", "caseStudy", id],
    queryFn: () => api.get<AdminCaseStudyDto>(`/api/admin/case-studies/${id}`),
  });

/** Any admin write. Content is shared between admin and public views, so refresh everything. */
export function useAdminMutation<TVariables = void, TData = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    // Not awaited, so callers can navigate away (e.g. after a delete) before refetches land.
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
}
