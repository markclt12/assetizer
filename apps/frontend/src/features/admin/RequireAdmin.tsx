import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ErrorState, LoadingState } from "../../components/States";
import { useIsAdminSignedIn } from "../../lib/auth";
import { useAdminMe } from "./api";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const signedIn = useIsAdminSignedIn();
  const location = useLocation();
  const me = useAdminMe(signedIn);

  if (!signedIn) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  if (me.isPending) return <LoadingState label="Checking your kitchen pass..." />;
  if (me.isError) return <ErrorState error={me.error} onRetry={() => me.refetch()} />;

  return <>{children}</>;
}
