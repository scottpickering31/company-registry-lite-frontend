"use client";

import ActionsButtonSet from "@/src/components/buttons/ActionsButtonSet";
import type { ColumnDef } from "@/src/types/columns.types";
import type { Company } from "@/src/types/companies.types";
import type { CompanyColumnConfig } from "@/src/types/dashboard.types";

const toDisplayStatus = (status: string) => {
  const normalized = String(status).trim().toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "dormant") return "Dormant";
  return status;
};

const getStatusColor = (status: string) => {
  const normalized = String(status).trim().toLowerCase();
  if (normalized === "active") return "green";
  if (normalized === "dormant") return "red";
  return "inherit";
};

const renderCell = (column: CompanyColumnConfig, company: Company) => {
  switch (column.type) {
    case "bold":
      return <span style={{ fontWeight: 700 }}>{company.name}</span>;
    case "text":
      return column.key === "companyNumber"
        ? company.companyNumber
        : company.name;
    case "status":
      return (
        <span
          style={{
            fontWeight: 700,
            color: getStatusColor(company.status),
          }}
        >
          {toDisplayStatus(company.status)}
        </span>
      );
    case "actions":
      return (
        <ActionsButtonSet
          editActive={true}
          editHref={`/companies/company/${company.id}/edit`}
          deleteActive={true}
          deleteCompanyId={company.id}
          view={`/companies/company/${company.id}`}
        />
      );
    default:
      return null;
  }
};

export const buildCompanyColumns = (
  columns: CompanyColumnConfig[],
): ColumnDef<Company>[] =>
  columns.map((column) => ({
    header: column.header,
    cell: (company) => renderCell(column, company),
  }));
