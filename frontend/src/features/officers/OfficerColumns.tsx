"use client";

import OfficerActionsButtonSet from "@/src/features/officers/OfficerActionsButtonSet";
import type { ColumnDef } from "@/src/types/columns.types";
import { Officers } from "@/src/types/officers.types";

const formatUkDateTime = (value: string) => {
  if (!value) return { date: "", time: "" };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: value, time: "" };
  }

  return {
    date: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date),
  };
};

export const buildOfficerColumns = (
  onOfficerDeleted?: () => void,
): ColumnDef<Officers>[] => [
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
    cell: (c) => {
      const value = formatUkDateTime(c.appointed);
      return (
        <span style={{ fontWeight: 700 }}>
          <div>{value.date}</div>
          <div style={{ fontWeight: 500, fontSize: "12px" }}>{value.time}</div>
        </span>
      );
    },
  },
  {
    header: "Resigned",
    cell: (c) => {
      const value = formatUkDateTime(c.resigned);
      if (!value.date) return <span style={{ fontWeight: 700 }}>-</span>;
      return (
        <span style={{ fontWeight: 700 }}>
          <div>{value.date}</div>
          <div style={{ fontWeight: 500, fontSize: "12px" }}>{value.time}</div>
        </span>
      );
    },
  },
  {
    header: "Actions",
    cell: (c) => (
      <OfficerActionsButtonSet
        officerId={c.id}
        viewHref={`/officers/officer/${c.id}`}
        onDeleted={onOfficerDeleted}
      />
    ),
  },
];
