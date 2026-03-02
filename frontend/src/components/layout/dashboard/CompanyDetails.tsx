"use client";

import MuiContainer from "../mui/MuiContainer";
import { Divider } from "@mui/material";
import MuiButton from "../../buttons/MuiButton";
import Link from "next/link";
import type { CompanyProfile } from "@/src/types/company-profile.types";

type Props = {
  profile: CompanyProfile | null;
  isLoading?: boolean;
};

export default function CompanyDetails({ profile, isLoading = false }: Props) {
  const hasProfile = Boolean(profile);

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
          Company Details:
        </p>
      </MuiContainer>
      <Divider />
      <MuiContainer
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "1.25rem",
          py: "1.25rem",
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
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6b6157",
            }}
          >
            Company Number:
          </p>
          <p
            style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}
          >
            {isLoading
              ? "Loading..."
              : hasProfile
                ? profile.company.companyNumber
                : "-"}
          </p>
          <Divider sx={{ my: "0.75rem" }} />
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6b6157",
            }}
          >
            Status:
          </p>
          <p
            style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}
          >
            {isLoading ? "Loading..." : hasProfile ? profile.company.status : "-"}
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
          <MuiContainer
            sx={{
              display: "grid",
              gap: "0.6rem",
            }}
          >
            {isLoading && (
              <p style={{ color: "#6b6157", fontWeight: 600 }}>Loading officers...</p>
            )}
            {!isLoading && !hasProfile && (
              <p style={{ color: "#6b6157", fontWeight: 600 }}>
                Select a company from the table to view officers.
              </p>
            )}
            {!isLoading && hasProfile && profile.officers.length === 0 && (
              <p style={{ color: "#6b6157", fontWeight: 600 }}>No officers for this company.</p>
            )}
            {!isLoading &&
              hasProfile &&
              profile.officers.map((officer) => (
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
                  <span style={{ color: "#6b6157", fontWeight: 600 }}>
                    {" "}
                    · {officer.role}
                  </span>
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
          paddingY: "1rem",
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
        {isLoading && (
          <li
            style={{
              padding: "0.7rem 0.85rem",
              backgroundColor: "#ffffff",
              border: "1px solid #eee7dd",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Loading filings...
          </li>
        )}
        {!isLoading && !hasProfile && (
          <li
            style={{
              padding: "0.7rem 0.85rem",
              backgroundColor: "#ffffff",
              border: "1px solid #eee7dd",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            Select a company from the table to view filings.
          </li>
        )}
        {!isLoading && hasProfile && profile.filings.length === 0 && (
          <li
            style={{
              padding: "0.7rem 0.85rem",
              backgroundColor: "#ffffff",
              border: "1px solid #eee7dd",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            No filings for this company.
          </li>
        )}
        {!isLoading &&
          hasProfile &&
          profile.filings.slice(0, 5).map((filing) => (
            <li
              key={filing.id}
              style={{
                padding: "0.7rem 0.85rem",
                backgroundColor: "#ffffff",
                border: "1px solid #eee7dd",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              {filing.type}
              <span style={{ color: "#6b6157", fontWeight: 600 }}>
                {" "}
                · {filing.dateSubmitted}
              </span>
            </li>
          ))}
      </MuiContainer>
    </MuiContainer>
  );
}
