import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  CheckAnswersRequest,
  CheckAnswersResponse,
  PublicActivityDto,
} from "@assetizers/shared";
import { api } from "../../lib/api";

export const useActivity = (id: string | undefined) =>
  useQuery({
    queryKey: ["activity", id],
    queryFn: () => api.get<PublicActivityDto>(`/api/activities/${id}`),
    enabled: Boolean(id),
  });

/** Stateless check: answers are sent, feedback comes back, nothing is saved anywhere. */
export const useCheckAnswers = (id: string) =>
  useMutation({
    mutationFn: (body: CheckAnswersRequest) =>
      api.post<CheckAnswersResponse>(`/api/activities/${id}/check`, body),
  });
