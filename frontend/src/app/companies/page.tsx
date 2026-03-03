import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { fetchCompanyTable } from "@/src/lib/dashboardApi";
import Link from "next/link";
import CompanyTablePanel from "@/src/features/dashboard/CompanyTablePanel";

const COMPANY_TABLE_FETCH_LIMIT = 1000;

export default async function Companies() {
  const initialData = await fetchCompanyTable({
    page: 1,
    pageSize: COMPANY_TABLE_FETCH_LIMIT,
  });
  const tableDataVersion = `${initialData.total ?? 0}:${(initialData.rows ?? [])
    .map((row) => row.id)
    .join(",")}`;

  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader
          title="Companies"
          subTitle="Company list"
          buttonSlot={
            <Link href="/companies/company/add-company">
              <MuiButton>Add New Company</MuiButton>
            </Link>
          }
        />
        <CompanyTablePanel
          key={tableDataVersion}
          initialData={initialData}
          querySelectTitles={[
            { id: 1, label: "Status:", values: ["All", "Active", "Dormant"] },
            { id: 2, label: "Sort By:", values: ["Name", "Company Number"] },
          ]}
          textFieldLabel="Search Companies..."
          rowsPerPageOptions={[8, 12, 15]}
        />
      </MuiContainer>
    </>
  );
}
