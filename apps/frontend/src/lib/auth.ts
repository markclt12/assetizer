import { useSyncExternalStore } from "react";

// The admin JWT lives only here. Learner data is never stored anywhere.
const TOKEN_KEY = "assetizers.adminToken";
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  emit();
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** True while an admin token is present (validity is checked against /api/auth/me). */
export function useIsAdminSignedIn(): boolean {
  return useSyncExternalStore(subscribe, () => getAdminToken() !== null, () => false);
}
