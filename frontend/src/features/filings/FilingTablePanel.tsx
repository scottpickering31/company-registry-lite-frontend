"use client";

import { useCallback, useMemo, useState } from "react";
import MuiQueryInput from "@/src/components/layout/mui/MuiQueryInput";
import { TableClient } from "@/src/features/table";
import { FilingColumns } from "@/src/features/filings/FilingColumns";
import type { Filing } from "@/src/types/filings.types";

type SelectConfig = {
  id: number;
  label: string;
  values: string[];
};

type Props = {
  initialRows: Filing[];
  querySelectTitles: SelectConfig[];
  rowsPerPageOptions: [number, number, number];
};

const DEFAULT_COMPANY_ID = 1;
const DEFAULT_TYPE_ID = 2;

export default function FilingTablePanel({
  initialRows,
  querySelectTitles,
  rowsPerPageOptions,
}: Props) {
  const [filteredRows, setFilteredRows] = useState<Filing[]>(initialRows);

  const handleQueryChange = useCallback(
    ({
      input,
      selectedById,
    }: {
      input: string;
      selectedById: Record<number, string>;
    }) => {
      const q = input.trim().toLowerCase();
      const company = selectedById[DEFAULT_COMPANY_ID] ?? "All Companies";
      const type = selectedById[DEFAULT_TYPE_ID] ?? "All Types";

      const nextRows = initialRows.filter((row) => {
        const matchesCompany =
          company === "All Companies" || row.name === company;
        const matchesType = type === "All Types" || row.type === type;

        if (!q) return matchesCompany && matchesType;

        const matchesSearch =
          row.name.toLowerCase().includes(q) ||
          row.type.toLowerCase().includes(q) ||
          row.submittedBy.toLowerCase().includes(q) ||
          row.dateSubmitted.toLowerCase().includes(q) ||
          String(row.filingId).includes(q);

        return matchesCompany && matchesType && matchesSearch;
      });

      setFilteredRows(nextRows);
    },
    [initialRows],
  );

  const columns = useMemo(() => FilingColumns, []);

  return (
    <>
      <MuiQueryInput
        querySelectTitles={querySelectTitles}
        textFieldLabel="Search filings..."
        onQueryChange={handleQueryChange}
        debounceMs={300}
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
