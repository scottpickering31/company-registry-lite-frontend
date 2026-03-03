"use client";

import MuiTable from "@/src/components/layout/mui/MuiTable";
import type { ColumnDef } from "@/src/types/columns.types";

type TableClientProps<T extends { id: number; name: string }> = {
  rows: T[];
  columns: ColumnDef<T>[];
  rowsPerPageOptions: [number, number, number];
  enableClientFiltering?: boolean;
  searchQuery?: string;
  selectedRowId?: number | null;
  onRowSelect?: (row: T) => void;
};

export default function TableClient<T extends { id: number; name: string }>({
  rows,
  columns,
  rowsPerPageOptions,
  enableClientFiltering,
  searchQuery,
  selectedRowId,
  onRowSelect,
}: TableClientProps<T>) {
  return (
    <MuiTable
      rows={rows}
      columns={columns}
      rowsPerPageOptions={rowsPerPageOptions}
      enableClientFiltering={enableClientFiltering}
      searchQuery={searchQuery}
      selectedRowId={selectedRowId}
      onRowSelect={onRowSelect}
    />
  );
}
