import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { fetchCompanyTable } from "@/src/lib/dashboardApi";
import DashboardClient from "@/src/features/dashboard/DashboardClient";

const COMPANY_TABLE_FETCH_LIMIT = 1000;

export default async function Dashboard() {
  const initialData = await fetchCompanyTable({
    page: 1,
    pageSize: COMPANY_TABLE_FETCH_LIMIT,
  });

  return (
    <>
      <MuiNavigation />
      <DashboardClient initialData={initialData} />
    </>
  );
}
