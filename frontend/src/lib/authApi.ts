const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const requireApiBase = () => {
  if (!API_BASE) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in frontend .env.local");
  }
};

const parseErrorMessage = async (response: Response, fallback: string) => {
  const data = (await response.json().catch(() => ({}))) as { message?: string };
  return data.message || fallback;
};

export const signupRequest = async (
  payload: SignupPayload,
): Promise<AuthResponse> => {
  requireApiBase();

  const response = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Signup failed"));
  }

  return response.json();
};

export const loginRequest = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  requireApiBase();

  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "Login failed"));
  }

  return response.json();
};
