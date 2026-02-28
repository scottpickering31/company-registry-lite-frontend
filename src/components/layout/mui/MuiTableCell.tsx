"use client";

import { TableCell, type TableCellProps } from "@mui/material";
import type { ReactNode } from "react";

type Props = TableCellProps & { children: ReactNode };

export default function MuiTableCell({ children, sx, ...props }: Props) {
  return (
    <TableCell
      {...props}
      sx={{
        fontSize: "15px",
        color: "#3f3a33",
        paddingY: "0.9rem",
        paddingX: "1rem",
        lineHeight: 1.4,
        "& .cell-secondary": {
          color: "#6b6157",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginLeft: "0.5rem",
        },
        ...sx,
      }}
    >
      {children}
    </TableCell>
  );
}
