"use client";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import { useMemo, useState } from "react";
import MuiTableCell from "@/src/components/layout/mui/MuiTableCell";
import type { ColumnDef } from "@/src/types/columns.types";
import { useInputStore } from "@/src/store/input.store";

type Props<T extends { id: number; name: string }> = {
  rows: T[];
  columns: ColumnDef<T>[];
  rowsPerPageOptions: [number, number, number];
};

export default function MuiTable<T extends { id: number; name: string }>({
  rows,
  columns,
  rowsPerPageOptions = [3, 5, 10],
}: Props<T>) {
  const { input } = useInputStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredInput = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(q));
  }, [input, rows]);

  const filteredRows = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(q));
  }, [input, rows]);

  const visibleRows = useMemo(
    () =>
      filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredRows, page, rowsPerPage],
  );

  return (
    <div
      className="mt-4"
      style={{
        borderRadius: "16px",
        border: "1px solid #e6e0d8",
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,245,240,1) 100%)",
        boxShadow: "0 18px 45px rgba(23, 22, 20, 0.12)",
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 440,
          backgroundColor: "transparent",
          "& .MuiPaper-root": { backgroundColor: "transparent" },
        }}
        component={Paper}
      >
        <Table
          stickyHeader
          aria-label="table"
          sx={{
            "& .MuiTableCell-root": {
              borderBottom: "1px solid #eee7dd",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  backgroundColor: "#f2efe9",
                  color: "#3f3a33",
                  fontSize: "16px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                },
              }}
            >
              {columns.map((col) => (
                <MuiTableCell
                  key={col.header}
                  align={col.align ?? "center"}
                  sx={{
                    minWidth: col.width ?? 100,
                    backgroundColor: "#f2efe9",
                    ...col.sx,
                  }}
                >
                  {col.header}
                </MuiTableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& tr:nth-of-type(odd)": { backgroundColor: "#ffffff" },
              "& tr:nth-of-type(even)": { backgroundColor: "#fcfaf6" },
            }}
          >
            {visibleRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                selected={row.id === selectedId}
                onClick={() => setSelectedId(row.id)}
                sx={{
                  cursor: "pointer",
                  transition: "background-color 150ms ease",
                  "&:hover": {
                    backgroundColor: "#f3eee6",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#efe7dc !important",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#efe7dc !important",
                  },
                }}
              >
                {columns.map((col) => (
                  <MuiTableCell
                    key={col.header}
                    align={col.align ?? "center"}
                    sx={col.sx}
                  >
                    {col.cell(row)}
                  </MuiTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        sx={{
          backgroundColor: "#f2efe9",
          borderTop: "1px solid #e6e0d8",
        }}
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setPage(0);
        }}
      />
    </div>
  );
}
