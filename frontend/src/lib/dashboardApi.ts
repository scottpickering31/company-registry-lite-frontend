import type { CompanyTablePayload } from "@/src/types/dashboard.types";
import type { Officers } from "@/src/types/officers.types";
import type { AuditLog } from "@/src/types/audit-logs.types";
import type { Filing } from "@/src/types/filings.types";
import type { CompanyProfile } from "@/src/types/company-profile.types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;

export type FetchCompanyTableParams = {
  status?: "Active" | "Dormant" | "All";
  q?: string;
  sortBy?: "Name" | "Company Number";
  page?: number;
  pageSize?: number;
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

export const fetchCompanyTable = async (
  params?: FetchCompanyTableParams,
): Promise<CompanyTablePayload> => {
  const response = await fetch(
    `${API_BASE}/api/dashboard/companies${buildQueryString(params)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return { columns: [], rows: [] };
  }

  return response.json();
};

export const fetchOfficerTable = async (): Promise<Officers[]> => {
  const response = await fetch(`${API_BASE}/api/dashboard/officers`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
};

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await fetch(`${API_BASE}/api/dashboard/audit-logs`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
};

export const fetchFilings = async (): Promise<Filing[]> => {
  const response = await fetch(`${API_BASE}/api/dashboard/filings`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
};

export const fetchCompanyProfile = async (
  companyId: number,
): Promise<CompanyProfile | null> => {
  const response = await fetch(`${API_BASE}/api/dashboard/companies/${companyId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};
