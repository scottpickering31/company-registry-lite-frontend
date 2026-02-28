"use client";

import ActionsButtonSet from "@/src/components/buttons/ActionsButtonSet";
import type { ColumnDef } from "@/src/types/columns.types";
import type { Company } from "@/src/types/companies.types";

export const CompanyColumns: ColumnDef<Company>[] = [
  {
    header: "Company Name",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.name}</span>,
  },
  {
    header: "Company Number",
    cell: (c) => c.companyNumber,
  },
  {
    header: "Status",
    cell: (c) => (
      <span
        style={{
          fontWeight: 700,
          color: c.status === "Active" ? "green" : "red",
        }}
      >
        {c.status}
      </span>
    ),
  },
  {
    header: "Actions",
    cell: (c) => (
      <ActionsButtonSet editActive={true} view={`/companies/company/${c.id}`} />
    ),
  },
];
