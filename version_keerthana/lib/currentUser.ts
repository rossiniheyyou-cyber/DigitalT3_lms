/**
 * Current logged-in user (frontend only, localStorage).
 * Set on login; used by dashboard welcome and settings.
 */

const STORAGE_KEY = "digitalt3-current-user";

export type CurrentUser = {
  name: string;
  email: string;
};

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CurrentUser;
    }
  } catch (_) {}
  return null;
}

export function setCurrentUser(user: CurrentUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (_) {}
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

/** Derive display name from email when no name is stored (e.g. admin@digitalt3.com → Admin). */
export function getNameFromEmail(email: string): string {
  const part = email.split("@")[0];
  if (!part) return "Learner";
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}
