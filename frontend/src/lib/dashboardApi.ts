import type { CompanyTablePayload } from "@/src/types/dashboard.types";
import type { Officers } from "@/src/types/officers.types";
import type { AuditLog } from "@/src/types/audit-logs.types";
import type { Filing } from "@/src/types/filings.types";
import type { CompanyProfile } from "@/src/types/company-profile.types";
import type { OfficerDetails } from "@/src/types/officer-details.types";
import { buildAuthHeaders } from "@/src/lib/authSession";

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;

export type FetchCompanyTableParams = {
  status?: "Active" | "Dormant" | "All";
  q?: string;
  sortBy?: "Name" | "Company Number";
  page?: number;
  pageSize?: number;
};

export type UpdateCompanyPayload = {
  name: string;
  companyNumber: string;
  status: "Active" | "Dormant";
};

const buildQueryString = (params: FetchCompanyTableParams = {}) => {
  const searchParams = new URLSearchParams();

  if (params.status && params.status !== "All") {
    searchParams.set("status", params.status);
  }

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (typeof params.page === "number") {
    searchParams.set("page", String(params.page));
  }

  if (typeof params.pageSize === "number") {
    searchParams.set("pageSize", String(params.pageSize));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const requestJson = async <T>(
  url: string,
  fallback: T,
  headers?: HeadersInit,
): Promise<T> => {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      ...buildAuthHeaders(),
      ...(headers || {}),
    },
  });

  if (!response.ok) {
    return fallback;
  }

  return response.json() as Promise<T>;
};

const requestWithAuth = async <T>(url: string, init: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || "Request failed");
  }

  return response.json() as Promise<T>;
};

export const fetchCompanyTable = async (
  params?: FetchCompanyTableParams,
  headers?: HeadersInit,
): Promise<CompanyTablePayload> => {
  return requestJson(
    `${API_BASE}/api/dashboard/companies${buildQueryString(params)}`,
    {
      columns: [],
      rows: [],
    } as CompanyTablePayload,
    headers,
  );
};

export const fetchOfficerTable = async (headers?: HeadersInit): Promise<Officers[]> => {
  return requestJson(`${API_BASE}/api/dashboard/officers`, [] as Officers[], headers);
};

export const fetchOfficerDetails = async (
  officerId: number,
  headers?: HeadersInit,
): Promise<OfficerDetails | null> => {
  return requestJson(`${API_BASE}/api/dashboard/officers/${officerId}`, null, headers);
};

export const fetchAuditLogs = async (headers?: HeadersInit): Promise<AuditLog[]> => {
  return requestJson(`${API_BASE}/api/dashboard/audit-logs`, [] as AuditLog[], headers);
};

export const fetchFilings = async (headers?: HeadersInit): Promise<Filing[]> => {
  return requestJson(`${API_BASE}/api/dashboard/filings`, [] as Filing[], headers);
};

export const fetchCompanyProfile = async (
  companyId: number,
  headers?: HeadersInit,
): Promise<CompanyProfile | null> => {
  return requestJson(`${API_BASE}/api/dashboard/companies/${companyId}`, null, headers);
};

export const updateCompany = async (
  companyId: number,
  payload: UpdateCompanyPayload,
) => {
  return requestWithAuth(`${API_BASE}/api/dashboard/companies/${companyId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteCompany = async (companyId: number) => {
  return requestWithAuth(`${API_BASE}/api/dashboard/companies/${companyId}`, {
    method: "DELETE",
    headers: {},
  });
};

export const deleteOfficer = async (officerId: number) => {
  return requestWithAuth(`${API_BASE}/api/dashboard/officers/${officerId}`, {
    method: "DELETE",
    headers: {},
  });
};
