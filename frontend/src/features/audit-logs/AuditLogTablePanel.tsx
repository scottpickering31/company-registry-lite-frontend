"use client";

import { useCallback, useMemo, useState } from "react";
import MuiQueryInput from "@/src/components/layout/mui/MuiQueryInput";
import { TableClient } from "@/src/features/table";
import { auditLogColumns } from "@/src/features/audit-logs/AuditLogColumns";
import type { AuditLog } from "@/src/types/audit-logs.types";

type SelectConfig = {
  id: number;
  label: string;
  values: string[];
};

type Props = {
  initialRows: AuditLog[];
  querySelectTitles: SelectConfig[];
  rowsPerPageOptions: [number, number, number];
};

const DEFAULT_EVENT_ID = 1;
const DEFAULT_COMPANY_ID = 2;
const DEFAULT_OFFICER_ID = 3;
const ALL_EVENTS = "All";
const ALL_COMPANIES = "All Companies";
const ALL_OFFICERS = "Any";

const normalize = (value: string | null | undefined) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export default function AuditLogTablePanel({
  initialRows,
  querySelectTitles,
  rowsPerPageOptions,
}: Props) {
  const [filteredRows, setFilteredRows] = useState<AuditLog[]>(initialRows);

  const handleQueryChange = useCallback(
    ({
      selectedById,
    }: {
      input: string;
      selectedById: Record<number, string>;
    }) => {
      const eventType = selectedById[DEFAULT_EVENT_ID] ?? ALL_EVENTS;
      const company = selectedById[DEFAULT_COMPANY_ID] ?? ALL_COMPANIES;
      const officer = selectedById[DEFAULT_OFFICER_ID] ?? ALL_OFFICERS;
      const eventNeedle = normalize(eventType);
      const companyNeedle = normalize(company);
      const officerNeedle = normalize(officer);

      const nextRows = initialRows.filter((row) => {
        const matchesEvent =
          eventNeedle === normalize(ALL_EVENTS) ||
          normalize(row.event) === eventNeedle;
        const matchesCompany =
          companyNeedle === normalize(ALL_COMPANIES) ||
          normalize(row.companyName) === companyNeedle;
        const matchesOfficer =
          officerNeedle === normalize(ALL_OFFICERS) ||
          normalize(row.officerName) === officerNeedle;

        return matchesEvent && matchesCompany && matchesOfficer;
      });

      setFilteredRows(nextRows);
    },
    [initialRows],
  );

  const columns = useMemo(() => auditLogColumns, []);

  return (
    <>
      <MuiQueryInput
        querySelectTitles={querySelectTitles}
        textFieldActive={false}
        onQueryChange={handleQueryChange}
        debounceMs={100}
      />
      <TableClient
        rows={filteredRows}
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        enableClientFiltering={false}
      />
    </>
  );
}
