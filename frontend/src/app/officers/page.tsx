import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { OfficerTablePanel } from "@/src/features/officers";
import { fetchCompanyTable, fetchOfficerTable } from "@/src/lib/dashboardApi";
import { getServerAuthHeaders } from "@/src/lib/serverAuth";
import Link from "next/link";

export default async function Officers() {
  const authHeaders = await getServerAuthHeaders();
  const officers = await fetchOfficerTable(authHeaders);
  const companies = await fetchCompanyTable({
    page: 1,
    pageSize: 1000,
    sortBy: "Name",
  }, authHeaders);
  const companyNames = [
    "All Companies",
    ...new Set((companies.rows ?? []).map((company) => company.name)),
  ];
  const roleOptions = [
    ...new Set(officers.map((officer) => officer.role).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
  const roles = ["All Roles", ...roleOptions];

  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader
          title="Officers"
          buttonSlot={
            <Link href="/officers/officer/add-officer">
              <MuiButton>Add New Officer</MuiButton>
            </Link>
          }
          subTitle="Officer list"
        />
        <OfficerTablePanel
          initialRows={officers}
          querySelectTitles={[
            {
              id: 1,
              label: "Company:",
              values: companyNames,
            },
            { id: 2, label: "Role:", values: roles },
          ]}
          textFieldLabel="Search officers..."
          rowsPerPageOptions={[8, 12, 15]}
        />
      </MuiContainer>
    </>
  );
}
