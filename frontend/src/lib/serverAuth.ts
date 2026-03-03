import "server-only";
import { cookies } from "next/headers";
import { AUTH_TOKEN_KEY } from "@/src/lib/authSession";

export const getServerAuthHeaders = async (): Promise<HeadersInit> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_KEY)?.value?.trim();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};
