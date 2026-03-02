import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { fetchCompanyTable } from "@/src/lib/dashboardApi";
import DashboardClient from "@/src/features/dashboard/DashboardClient";

export default async function Dashboard() {
  const initialData = await fetchCompanyTable();

  return (
    <>
      <MuiNavigation />
      <DashboardClient initialData={initialData} />
    </>
  );
}
