import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import OfficerActionsButtonSet from "@/src/features/officers/OfficerActionsButtonSet";
import { fetchOfficerDetails } from "@/src/lib/dashboardApi";
import { Divider } from "@mui/material";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OfficerPage({ params }: PageProps) {
  const { id } = await params;
  const officerId = Number(id);
  const details = Number.isInteger(officerId)
    ? await fetchOfficerDetails(officerId)
    : null;

  if (!details) {
    return (
      <>
        <MuiNavigation />
        <MuiContainer>
          <MuiHeader
            title="Officer Not Found"
            subTitle="Officer"
            buttonSlot={
              <Link href="/officers">
                <MuiButton variant="outlined">Back to Officers</MuiButton>
              </Link>
            }
          />
        </MuiContainer>
      </>
    );
  }

  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader
          title={details.officer.name}
          subTitle={details.officer.role}
          buttonSlot={
            <Link href="/officers">
              <MuiButton variant="outlined">Back to Officers</MuiButton>
            </Link>
          }
        />

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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: "1rem",
              gap: "1rem",
            }}
          >
            <p style={{ fontWeight: 800, fontSize: "20px", margin: 0 }}>
              Officer Details
            </p>
            <OfficerActionsButtonSet
              officerId={details.officer.id}
              viewHref={`/officers/officer/${details.officer.id}`}
              showView={false}
              redirectTo="/officers"
            />
          </MuiContainer>

          <Divider />

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
                Officer ID
              </p>
              <p style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}>
                {details.officer.id}
              </p>
              <Divider sx={{ my: "0.75rem" }} />
              <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
                Appointed
              </p>
              <p style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}>
                {details.officer.appointed}
              </p>
              <Divider sx={{ my: "0.75rem" }} />
              <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
                Resigned
              </p>
              <p style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}>
                {details.officer.resigned || "-"}
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
              <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
                Company
              </p>
              <p style={{ fontSize: "20px", fontWeight: 800, marginTop: "0.35rem" }}>
                {details.company.name}
              </p>
              <Divider sx={{ my: "0.75rem" }} />
              <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
                Company Number
              </p>
              <p style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}>
                {details.company.companyNumber}
              </p>
              <Divider sx={{ my: "0.75rem" }} />
              <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#6b6157" }}>
                Company Status
              </p>
              <p style={{ fontSize: "18px", fontWeight: 700, marginTop: "0.35rem" }}>
                {details.company.status}
              </p>
            </MuiContainer>
          </MuiContainer>

          <Divider />

          <MuiContainer sx={{ py: "1rem" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, marginBottom: "0.6rem" }}>
              Recent Filings Submitted By Officer
            </p>
            {details.recentFilings.length === 0 ? (
              <p style={{ fontWeight: 600, color: "#6b6157" }}>No submitted filings found.</p>
            ) : (
              <MuiContainer component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: "0.5rem" }}>
                {details.recentFilings.map((filing) => (
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
                      {filing.type} · {filing.submittedAt}
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
            )}
          </MuiContainer>

          <Divider />

          <MuiContainer sx={{ py: "1rem" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, marginBottom: "0.6rem" }}>
              Recent Audit Events
            </p>
            {details.recentAuditLogs.length === 0 ? (
              <p style={{ fontWeight: 600, color: "#6b6157" }}>No audit events found.</p>
            ) : (
              <MuiContainer component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: "0.5rem" }}>
                {details.recentAuditLogs.map((event) => (
                  <li
                    key={event.id}
                    style={{
                      padding: "0.7rem 0.85rem",
                      backgroundColor: "#ffffff",
                      border: "1px solid #eee7dd",
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {event.event}
                    <span style={{ color: "#6b6157", fontWeight: 600 }}> · {event.occurredAt}</span>
                  </li>
                ))}
              </MuiContainer>
            )}
          </MuiContainer>
        </MuiContainer>
      </MuiContainer>
    </>
  );
}
