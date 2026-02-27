import React from "react";
import MuiContainer from "../mui/MuiContainer";
import { Divider } from "@mui/material";
import Link from "next/link";

export default function AuditLog() {
  return (
    <MuiContainer
      sx={{
        p: "1.5rem",
        mt: "1rem",
        width: "50rem",
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
        <li
          style={{
            padding: "0.75rem 0.85rem",
            backgroundColor: "#ffffff",
            border: "1px solid #eee7dd",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Filing submitted by Admin
          <span style={{ color: "#6b6157", fontWeight: 600 }}>
            {" "}
            - 01/10/2023
          </span>
        </li>
        <li
          style={{
            padding: "0.75rem 0.85rem",
            backgroundColor: "#ffffff",
            border: "1px solid #eee7dd",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Officer added: John Doe
          <span style={{ color: "#6b6157", fontWeight: 600 }}>
            {" "}
            - 15/09/2023
          </span>
        </li>
        <li
          style={{
            padding: "0.75rem 0.85rem",
            backgroundColor: "#ffffff",
            border: "1px solid #eee7dd",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Company created by Admin
          <span style={{ color: "#6b6157", fontWeight: 600 }}>
            {" "}
            - 12/01/2015
          </span>
        </li>
      </MuiContainer>
      <Divider />
      <MuiContainer
        sx={{ display: "flex", justifyContent: "flex-end", pt: "0.5rem" }}
      >
        <Link href="/audit-logs/view-audit-logs">
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
