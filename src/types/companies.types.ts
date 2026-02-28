export type CompanyStatus = "Active" | "Dormant";

export interface Company {
  id: number;
  name: string;
  status: CompanyStatus;
  companyNumber: string;
}
