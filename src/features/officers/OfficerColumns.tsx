"use client";

import ActionsButtonSet from "@/src/components/buttons/ActionsButtonSet";
import type { ColumnDef } from "@/src/types/columns.types";
import { Officers } from "@/src/types/officers.types";

export const OfficerColumns: ColumnDef<Officers>[] = [
  {
    header: "ID",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.id}</span>,
  },
  {
    header: "Name",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.name}</span>,
  },
  {
    header: "Company Name",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.company}</span>,
  },
  {
    header: "Role",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.role}</span>,
  },
  {
    header: "Appointed",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.appointed}</span>,
  },
  {
    header: "Resigned",
    cell: (c) => <span style={{ fontWeight: 700 }}>{c.resigned}</span>,
  },
  {
    header: "Actions",
    cell: (c) => (
      <ActionsButtonSet editActive={false} view={`/companies/${c.id}`} />
    ),
  },
];
