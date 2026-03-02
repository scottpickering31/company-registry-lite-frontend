export interface AuditLog {
  id: number;
  name: string;
  occurredAt: string;
  event: string;
  companyName: string;
  officerName: string;
}
