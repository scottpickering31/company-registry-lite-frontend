import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import AuditLog from "@/src/components/layout/dashboard/AuditLog";
import CompanyDetails from "@/src/components/layout/dashboard/CompanyDetails";
import { fetchCompanyTable } from "@/src/lib/dashboardApi";
import MuiButton from "../components/buttons/MuiButton";
import Link from "next/link";
import CompanyTablePanel from "@/src/features/dashboard/CompanyTablePanel";

export default async function Dashboard() {
  const initialData = await fetchCompanyTable();

  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader
          title="Company Management"
          subTitle="Dashboard"
          buttonSlot={
            <Link href="/companies/company/add-company">
              <MuiButton>Add New Company</MuiButton>
            </Link>
          }
        />
        <CompanyTablePanel
          initialData={initialData}
          querySelectTitles={[
            { id: 1, label: "Status:", values: ["All", "Active", "Dormant"] },
            { id: 2, label: "Sort By:", values: ["Name", "Company Number"] },
          ]}
          textFieldLabel="Search Companies..."
          rowsPerPageOptions={[3, 5, 10]}
        />
      </MuiContainer>

      <MuiContainer sx={{ display: "flex", flexDirection: "row" }}>
        <CompanyDetails />
        <AuditLog />
      </MuiContainer>
    </>
  );
}
