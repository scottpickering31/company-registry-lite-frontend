"use client";

import type { ColumnDef } from "@/src/types/columns.types";
import { Filing } from "@/src/types/filings.types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

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
    header: "Document",
    cell: (c) => (
      <a
        href={`${API_BASE}${c.documentPath}`}
        target="_blank"
        rel="noreferrer"
        style={{ fontWeight: 700, textDecoration: "underline" }}
      >
        {c.documentName || "View PDF"}
      </a>
    ),
  },
];
