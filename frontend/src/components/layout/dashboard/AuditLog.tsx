"use client";

import MuiContainer from "../mui/MuiContainer";
import { Divider } from "@mui/material";
import Link from "next/link";
import type { CompanyProfile } from "@/src/types/company-profile.types";

type Props = {
  profile: CompanyProfile | null;
  isLoading?: boolean;
};

export default function AuditLog({ profile, isLoading = false }: Props) {
  return (
    <MuiContainer
      sx={{
        p: "1.5rem",
        mt: "1rem",
        flex: 1,
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,245,240,1) 100%)",
        borderRadius: "16px",
        border: "1px solid #e6e0d8",
        boxShadow: "0 18px 45px rgba(23, 22, 20, 0.12)",
      }}
    >
      <MuiContainer
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "0.75rem",
        }}
      >
        <p
          style={{
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Audit Log
        </p>
      </MuiContainer>
      <Divider />
      <MuiContainer
        component="ul"
        sx={{
          px: "0.5rem",
          py: "0.75rem",
          listStyle: "none",
          m: 0,
          display: "grid",
          gap: "0.6rem",
          color: "#3f3a33",
        }}
      >
        {isLoading && (
          <li
            style={{
              padding: "0.75rem 0.85rem",
              backgroundColor: "#ffffff",
              border: "1px solid #eee7dd",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Loading audit logs...
          </li>
        )}
        {!isLoading && !profile && (
          <li
            style={{
              padding: "0.75rem 0.85rem",
              backgroundColor: "#ffffff",
              border: "1px solid #eee7dd",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Select a company from the table to view audit logs.
          </li>
        )}
        {!isLoading && profile && profile.auditLogs.length === 0 && (
          <li
            style={{
              padding: "0.75rem 0.85rem",
              backgroundColor: "#ffffff",
              border: "1px solid #eee7dd",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            No audit logs for this company.
          </li>
        )}
        {!isLoading &&
          profile &&
          profile.auditLogs.map((log) => (
            <li
              key={log.id}
              style={{
                padding: "0.75rem 0.85rem",
                backgroundColor: "#ffffff",
                border: "1px solid #eee7dd",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              {log.event}
              <span style={{ color: "#6b6157", fontWeight: 600 }}>
                {" "}
                · {log.officerName}
                {" - "}
                {log.occurredAt}
              </span>
            </li>
          ))}
      </MuiContainer>
      <Divider />
      <MuiContainer
        sx={{ display: "flex", justifyContent: "flex-end", pt: "0.5rem" }}
      >
        <Link href="/audit-logs">
          <p
            style={{
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#3633de",
            }}
          >
            View all logs
          </p>
        </Link>
      </MuiContainer>
    </MuiContainer>
  );
}
