export type OfficerDetails = {
  officer: {
    id: number;
    name: string;
    role: string;
    appointed: string;
    resigned: string;
  };
  company: {
    id: number;
    name: string;
    companyNumber: string;
    status: string;
  };
  recentFilings: Array<{
    id: number;
    type: string;
    description: string;
    submittedAt: string;
    documentName: string;
    documentPath: string;
    companyId: number;
    companyName: string;
  }>;
  recentAuditLogs: Array<{
    id: number;
    occurredAt: string;
    event: string;
    companyId: number;
    companyName: string;
  }>;
};
