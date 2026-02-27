import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import MuiQueryInput from "@/src/components/layout/mui/MuiQueryInput";
import { auditLogColumns } from "@/src/features/audit-logs";
import { TableClient } from "@/src/features/table";
import { mockAuditLogs } from "@/src/mocks/audit-logs";

export default function AuditLogs() {
  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader title="Audit Logs" subTitle="Audits" />
        <MuiQueryInput
          querySelectTitles={[
            {
              id: 1,
              label: "Event Type:",
              values: ["All", "Active", "Dormant"],
            },
            { id: 2, label: "Company:", values: ["All Companies, 1, 2, 3"] },
            { id: 3, label: "Actor:", values: ["Any", "Active", "Dormant"] },
          ]}
          textFieldActive={false}
        />
        <TableClient
          rows={mockAuditLogs}
          columns={auditLogColumns}
          rowsPerPageOptions={[8, 12, 15]}
        />
      </MuiContainer>
    </>
  );
}
