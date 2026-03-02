import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import type { CompanyProfile } from "@/src/types/company-profile.types";
import { Divider } from "@mui/material";
import Link from "next/link";

type Props = {
  profile: CompanyProfile;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function CompanyProfilePanel({ profile }: Props) {
  return (
    <MuiContainer
      sx={{
        p: "1.5rem",
        mt: "1rem",
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,245,240,1) 100%)",
        borderRadius: "16px",
        border: "1px solid #e6e0d8",
        boxShadow: "0 18px 45px rgba(23, 22, 20, 0.12)",
      }}
    >
      <MuiContainer
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: "1rem",
          py: "1rem",
        }}
      >
        <MuiContainer
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #eee7dd",
            borderRadius: "12px",
            p: "1rem",
          }}
        >
          <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
            Company Name
          </p>
          <p style={{ fontSize: "20px", fontWeight: 800, marginTop: "0.35rem" }}>
            {profile.company.name}
          </p>
          <Divider sx={{ my: "0.75rem" }} />
          <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
            Company Number
          </p>
          <p style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}>
            {profile.company.companyNumber}
          </p>
          <Divider sx={{ my: "0.75rem" }} />
          <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
            Status
          </p>
          <p style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}>
            {profile.company.status}
          </p>
          <Divider sx={{ my: "0.75rem" }} />
          <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
            Created
          </p>
          <p style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}>
            {profile.company.createdAt}
          </p>
        </MuiContainer>

        <MuiContainer
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #eee7dd",
            borderRadius: "12px",
            p: "1rem",
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
            <p style={{ fontSize: "16px", fontWeight: 700 }}>Officers</p>
            <Link href="/officers/officer/add-officer">
              <MuiButton>Add Officer</MuiButton>
            </Link>
          </MuiContainer>

          <MuiContainer sx={{ display: "grid", gap: "0.6rem" }}>
            {profile.officers.length === 0 && (
              <p style={{ color: "#6b6157", fontWeight: 600 }}>No officers found.</p>
            )}
            {profile.officers.map((officer) => (
              <MuiContainer
                key={officer.id}
                sx={{
                  px: "0.85rem",
                  py: "0.6rem",
                  backgroundColor: "#f7f3ee",
                  border: "1px solid #eadfd2",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {officer.name}
                <span style={{ color: "#6b6157", fontWeight: 600 }}> · {officer.role}</span>
              </MuiContainer>
            ))}
          </MuiContainer>
        </MuiContainer>
      </MuiContainer>

      <Divider />

      <MuiContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          py: "1rem",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: 700 }}>Recent Filings</p>
        <Link href="/filings/filing/add-filing">
          <MuiButton>File New Document</MuiButton>
        </Link>
      </MuiContainer>

      <Divider />

      <MuiContainer
        component="ul"
        sx={{
          px: "1rem",
          py: "0.75rem",
          listStyle: "none",
          m: 0,
          display: "grid",
          gap: "0.5rem",
          color: "#3f3a33",
        }}
      >
        {profile.filings.length === 0 && (
          <li
            style={{
              padding: "0.7rem 0.85rem",
              backgroundColor: "#ffffff",
              border: "1px solid #eee7dd",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            No filings yet.
          </li>
        )}

        {profile.filings.map((filing) => (
          <li
            key={filing.id}
            style={{
              padding: "0.7rem 0.85rem",
              backgroundColor: "#ffffff",
              border: "1px solid #eee7dd",
              borderRadius: "10px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <span>
              {filing.type} · {filing.dateSubmitted} · by {filing.submittedBy}
            </span>
            <a
              href={`${API_BASE}${filing.documentPath}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "underline" }}
            >
              {filing.documentName || "View PDF"}
            </a>
          </li>
        ))}
      </MuiContainer>
    </MuiContainer>
  );
}
