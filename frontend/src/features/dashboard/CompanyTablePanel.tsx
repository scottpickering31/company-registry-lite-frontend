"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import MuiQueryInput from "@/src/components/layout/mui/MuiQueryInput";
import { TableClient } from "@/src/features/table";
import { buildCompanyColumns } from "@/src/features/dashboard";
import { fetchCompanyTable } from "@/src/lib/dashboardApi";
import type { CompanyTablePayload } from "@/src/types/dashboard.types";

type CompanySortBy = "Name" | "Company Number";

type SelectConfig = {
  id: number;
  label: string;
  values: string[];
};

type Props = {
  initialData: CompanyTablePayload;
  querySelectTitles: SelectConfig[];
  textFieldLabel?: string;
  rowsPerPageOptions: [number, number, number];
};

const DEFAULT_STATUS_ID = 1;
const DEFAULT_SORT_ID = 2;
const COMPANY_TABLE_FETCH_LIMIT = 1000;

export default function CompanyTablePanel({
  initialData,
  querySelectTitles,
  textFieldLabel,
  rowsPerPageOptions,
}: Props) {
  const [data, setData] = useState<CompanyTablePayload>(initialData);
  const didInit = useRef(false);

  const columns = useMemo(
    () => buildCompanyColumns(data.columns ?? []),
    [data.columns],
  );

  const handleQueryChange = useCallback(
    async ({
      input,
      selectedById,
    }: {
      input: string;
      selectedById: Record<number, string>;
    }) => {
      if (!didInit.current) {
        didInit.current = true;
        return;
      }
      const status = selectedById[DEFAULT_STATUS_ID];
      const sortBy = selectedById[DEFAULT_SORT_ID];
      const q = input?.trim();

      const next = await fetchCompanyTable({
        status: status === "All" ? undefined : (status as "Active" | "Dormant"),
        sortBy: sortBy === "All" ? undefined : (sortBy as CompanySortBy),
        q: q ? q : undefined,
        page: 1,
        pageSize: COMPANY_TABLE_FETCH_LIMIT,
      });

      if (next.columns.length === 0) {
        setData((prev) => ({ ...prev, rows: [] }));
        return;
      }

      setData(next);
    },
    [],
  );

  return (
    <>
      <MuiQueryInput
        querySelectTitles={querySelectTitles}
        textFieldLabel={textFieldLabel}
        onQueryChange={handleQueryChange}
        debounceMs={500}
      />
      <TableClient
        columns={columns}
        rows={data.rows ?? []}
        rowsPerPageOptions={rowsPerPageOptions}
        enableClientFiltering={false}
      />
    </>
  );
}
