import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { AuditLogTablePanel } from "@/src/features/audit-logs";
import { fetchAuditLogs } from "@/src/lib/dashboardApi";
import { getServerAuthHeaders } from "@/src/lib/serverAuth";

export default async function AuditLogs() {
  const authHeaders = await getServerAuthHeaders();
  const auditLogs = await fetchAuditLogs(authHeaders);
  const eventTypes = [
    "All",
    ...new Set(
      auditLogs.map((log) => log.event.trim()).filter(Boolean),
    ),
  ].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });
  const companyNames = [
    "All Companies",
    ...new Set(
      auditLogs.map((log) => log.companyName.trim()).filter(Boolean),
    ),
  ].sort((a, b) => {
    if (a === "All Companies") return -1;
    if (b === "All Companies") return 1;
    return a.localeCompare(b);
  });
  const officers = [
    "Any",
    ...new Set(
      auditLogs.map((log) => log.officerName.trim()).filter(Boolean),
    ),
  ].sort((a, b) => {
    if (a === "Any") return -1;
    if (b === "Any") return 1;
    return a.localeCompare(b);
  });

  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader title="Audit Logs" subTitle="Audits" />
        <AuditLogTablePanel
          initialRows={auditLogs}
          querySelectTitles={[
            {
              id: 1,
              label: "Event Type:",
              values: eventTypes,
            },
            { id: 2, label: "Company:", values: companyNames },
            { id: 3, label: "Officer:", values: officers },
          ]}
          rowsPerPageOptions={[8, 12, 15]}
        />
      </MuiContainer>
    </>
  );
}
