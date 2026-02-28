import MuiContainer from "../mui/MuiContainer";
import { Divider } from "@mui/material";
import MuiButton from "../../buttons/MuiButton";
import Link from "next/link";

export default function CompanyDetails() {
  return (
    <MuiContainer
      sx={{
        p: "1.5rem",
        mt: "1rem",
        mr: "1rem",
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
          Company Details
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
            Company Number
          </p>
          <p
            style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}
          >
            {/* TODO */}
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
            Incorporated
          </p>
          <p
            style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}
          >
            {/* TODO */}
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
            <MuiContainer
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
              John Doe
              <span style={{ color: "#6b6157", fontWeight: 600 }}>
                {" "}
                · Director
              </span>
            </MuiContainer>
            <MuiContainer
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
              Jane Smith
              <span style={{ color: "#6b6157", fontWeight: 600 }}>
                {" "}
                · Secretary
              </span>
            </MuiContainer>
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
        <li
          style={{
            padding: "0.7rem 0.85rem",
            backgroundColor: "#ffffff",
            border: "1px solid #eee7dd",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Annual Report
        </li>
        <li
          style={{
            padding: "0.7rem 0.85rem",
            backgroundColor: "#ffffff",
            border: "1px solid #eee7dd",
            borderRadius: "10px",
            fontWeight: 600,
          }}
        >
          Annual Report
        </li>
      </MuiContainer>
    </MuiContainer>
  );
}
