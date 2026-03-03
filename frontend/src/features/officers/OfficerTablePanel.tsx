"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import MuiQueryInput from "@/src/components/layout/mui/MuiQueryInput";
import { TableClient } from "@/src/features/table";
import { buildOfficerColumns } from "@/src/features/officers/OfficerColumns";
import type { Officers } from "@/src/types/officers.types";
import { fetchOfficerTable } from "@/src/lib/dashboardApi";

type SelectConfig = {
  id: number;
  label: string;
  values: string[];
};

type Props = {
  initialRows: Officers[];
  querySelectTitles: SelectConfig[];
  textFieldLabel?: string;
  rowsPerPageOptions: [number, number, number];
};

const DEFAULT_COMPANY_ID = 1;
const DEFAULT_ROLE_ID = 2;

export default function OfficerTablePanel({
  initialRows,
  querySelectTitles,
  textFieldLabel,
  rowsPerPageOptions,
}: Props) {
  const [allRows, setAllRows] = useState<Officers[]>(initialRows);
  const [filteredRows, setFilteredRows] = useState<Officers[]>(initialRows);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setAllRows(initialRows);
    setFilteredRows(initialRows);
  }, [initialRows]);

  const handleQueryChange = useCallback(
    ({
      input,
      selectedById,
    }: {
      input: string;
      selectedById: Record<number, string>;
    }) => {
      const q = input.trim().toLowerCase();
      const company = selectedById[DEFAULT_COMPANY_ID];
      const role = selectedById[DEFAULT_ROLE_ID];

      const nextRows = allRows.filter((row) => {
        const matchesCompany = !company || company === "All Companies" || row.company === company;
        const matchesRole = !role || role === "All Roles" || row.role === role;

        if (!q) return matchesCompany && matchesRole;

        const matchesSearch =
          row.name.toLowerCase().includes(q) ||
          row.company.toLowerCase().includes(q) ||
          row.role.toLowerCase().includes(q) ||
          String(row.id).includes(q);

        return matchesCompany && matchesRole && matchesSearch;
      });

      setFilteredRows(nextRows);
    },
    [allRows],
  );

  const refreshRows = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const rows = await fetchOfficerTable();
      setAllRows(rows);
      setFilteredRows(rows);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const columns = useMemo(() => buildOfficerColumns(refreshRows), [refreshRows]);

  return (
    <>
      <MuiQueryInput
        querySelectTitles={querySelectTitles}
        textFieldLabel={textFieldLabel}
        onQueryChange={handleQueryChange}
        debounceMs={300}
      />
      <TableClient
        rows={filteredRows}
        columns={columns}
        rowsPerPageOptions={rowsPerPageOptions}
        enableClientFiltering={false}
      />
      {isRefreshing ? (
        <p style={{ marginTop: "0.75rem", fontWeight: 600, color: "#6b6157" }}>
          Refreshing officers...
        </p>
      ) : null}
    </>
  );
}
