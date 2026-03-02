export const AUTH_TOKEN_KEY = "crl_auth_token";
export const AUTH_USER_KEY = "crl_auth_user";

type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
};

const AUTH_COOKIE_NAME = "crl_auth_token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const isBrowser = () => typeof window !== "undefined";

export const getAuthToken = (): string | null => {
  if (!isBrowser()) return null;

  const fromStorage = window.localStorage.getItem(AUTH_TOKEN_KEY);
  if (fromStorage) return fromStorage;

  const cookieMatch = document.cookie.match(
    new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]+)`),
  );

  return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
};

export const getAuthUser = (): AuthUser | null => {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const saveAuthSession = (token: string, user: AuthUser) => {
  if (!isBrowser()) return;

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

export const clearAuthSession = () => {
  if (!isBrowser()) return;

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const buildAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};
