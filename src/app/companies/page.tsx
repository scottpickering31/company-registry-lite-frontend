import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import MuiQueryInput from "@/src/components/layout/mui/MuiQueryInput";
import { CompanyColumns } from "@/src/features/dashboard";
import { TableClient } from "@/src/features/table";
import { mockCompanies } from "@/src/mocks/dashboard";
import Link from "next/link";

export default function Companies() {
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
        <MuiQueryInput
          querySelectTitles={[
            { id: 1, label: "Status:", values: ["All", "Active", "Dormant"] },
            { id: 2, label: "Sort By:", values: ["Name", "Date Created"] },
          ]}
          textFieldLabel="Search Companies..."
        />
        <TableClient
          rows={mockCompanies}
          columns={CompanyColumns}
          rowsPerPageOptions={[8, 12, 15]}
        />
      </MuiContainer>
    </>
  );
}
