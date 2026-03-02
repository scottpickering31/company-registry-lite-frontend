import type { CompanyStatus } from "@/src/types/companies.types";

export type CompanyProfile = {
  company: {
    id: number;
    name: string;
    status: CompanyStatus | string;
    companyNumber: string;
    createdAt: string;
  };
  officers: Array<{
    id: number;
    name: string;
    role: string;
    appointed: string;
    resigned: string;
  }>;
  filings: Array<{
    id: number;
    filingId: number;
    type: string;
    dateSubmitted: string;
    submittedBy: string;
    documentName: string;
    documentPath: string;
  }>;
  auditLogs: Array<{
    id: number;
    occurredAt: string;
    event: string;
    officerName: string;
  }>;
};
