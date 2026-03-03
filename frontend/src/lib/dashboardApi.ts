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

export const fetchOfficerDetails = async (
  officerId: number,
): Promise<OfficerDetails | null> => {
  const response = await fetch(`${API_BASE}/api/dashboard/officers/${officerId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
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

export type UpdateCompanyPayload = {
  name: string;
  companyNumber: string;
  status: "Active" | "Dormant";
};

export const updateCompany = async (
  companyId: number,
  payload: UpdateCompanyPayload,
) => {
  const response = await fetch(`${API_BASE}/api/dashboard/companies/${companyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || "Failed to update company");
  }

  return response.json();
};

export const deleteCompany = async (companyId: number) => {
  const response = await fetch(`${API_BASE}/api/dashboard/companies/${companyId}`, {
    method: "DELETE",
    headers: {
      ...buildAuthHeaders(),
    },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || "Failed to delete company");
  }

  return response.json();
};

export const deleteOfficer = async (officerId: number) => {
  const response = await fetch(`${API_BASE}/api/dashboard/officers/${officerId}`, {
    method: "DELETE",
    headers: {
      ...buildAuthHeaders(),
    },
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || "Failed to delete officer");
  }

  return response.json();
};
