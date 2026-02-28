"use client";

import ActionsButtonSet from "@/src/components/buttons/ActionsButtonSet";
import type { ColumnDef } from "@/src/types/columns.types";
import { Filing } from "@/src/types/filings.types";

export const FilingColumns: ColumnDef<Filing>[] = [
  {
    header: "Filing ID",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.filingId}</span>,
  },
  {
    header: "Company Name",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.name}</span>,
  },
  {
    header: "Type",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.type}</span>,
  },
  {
    header: "Date Submitted",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.dateSubmitted}</span>,
  },
  {
    header: "Submitted By",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.submittedBy}</span>,
  },
  {
    header: "Actions",
    cell: (c) => (
      <ActionsButtonSet editActive={false} view={`/companies/${c.id}`} />
    ),
  },
];
