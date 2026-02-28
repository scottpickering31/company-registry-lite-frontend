import type { ReactNode } from "react";
import type { TableCellProps } from "@mui/material";

export type ColumnDef<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  align?: TableCellProps["align"];
  sx?: TableCellProps["sx"];
  width?: number | string;
};
