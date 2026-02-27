import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import MuiQueryInput from "@/src/components/layout/mui/MuiQueryInput";
import { FilingColumns } from "@/src/features/filings";
import { TableClient } from "@/src/features/table";
import { mockFilings } from "@/src/mocks/filings";
import Link from "next/link";

export default function Filings() {
  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader
          subTitle="Filing list"
          title="Filings"
          buttonSlot={
            <Link href="/filings/filing/add-filing">
              <MuiButton>File New Document</MuiButton>
            </Link>
          }
        />
        <MuiQueryInput
          querySelectTitles={[
            {
              id: 1,
              label: "Company:",
              values: ["All Companies", "Active", "Dormant"],
            },
            { id: 2, label: "Internal Ref:", values: ["Any, 1, 2, 3"] },
          ]}
          textFieldLabel="Search filings..."
        />
        <TableClient
          rows={mockFilings}
          columns={FilingColumns}
          rowsPerPageOptions={[8, 12, 15]}
        />
      </MuiContainer>
    </>
  );
}
