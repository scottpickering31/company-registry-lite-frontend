import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { FilingTablePanel } from "@/src/features/filings";
import { fetchFilings } from "@/src/lib/dashboardApi";
import { getServerAuthHeaders } from "@/src/lib/serverAuth";
import Link from "next/link";

export default async function Filings() {
  const authHeaders = await getServerAuthHeaders();
  const filings = await fetchFilings(authHeaders);
  const companies = [
    "All Companies",
    ...new Set(filings.map((filing) => filing.name).filter(Boolean)),
  ];
  const filingTypes = [
    "All Types",
    ...new Set(filings.map((filing) => filing.type).filter(Boolean)),
  ];

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
        <FilingTablePanel
          initialRows={filings}
          querySelectTitles={[
            {
              id: 1,
              label: "Company:",
              values: companies,
            },
            {
              id: 2,
              label: "Type:",
              values: filingTypes,
            },
          ]}
          rowsPerPageOptions={[8, 12, 15]}
        />
      </MuiContainer>
    </>
  );
}
