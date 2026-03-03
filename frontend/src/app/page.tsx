import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { fetchCompanyTable } from "@/src/lib/dashboardApi";
import DashboardClient from "@/src/features/dashboard/DashboardClient";
import { getServerAuthHeaders } from "@/src/lib/serverAuth";
import { redirect } from "next/navigation";

const COMPANY_TABLE_FETCH_LIMIT = 1000;

export default async function Dashboard() {
  const authHeaders = await getServerAuthHeaders();
  if (!("Authorization" in authHeaders)) {
    redirect("/login");
  }

  const initialData = await fetchCompanyTable(
    {
      page: 1,
      pageSize: COMPANY_TABLE_FETCH_LIMIT,
    },
    authHeaders,
  );

  return (
    <>
      <MuiNavigation />
      <DashboardClient initialData={initialData} />
    </>
  );
}
