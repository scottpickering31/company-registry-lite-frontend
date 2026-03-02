"use client";

import { useCallback, useEffect, useState } from "react";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import CompanyTablePanel from "@/src/features/dashboard/CompanyTablePanel";
import CompanyDetails from "@/src/components/layout/dashboard/CompanyDetails";
import AuditLog from "@/src/components/layout/dashboard/AuditLog";
import MuiButton from "@/src/components/buttons/MuiButton";
import Link from "next/link";
import type { CompanyTablePayload } from "@/src/types/dashboard.types";
import type { CompanyProfile } from "@/src/types/company-profile.types";
import { fetchCompanyProfile } from "@/src/lib/dashboardApi";

type Props = {
  initialData: CompanyTablePayload;
};

export default function DashboardClient({ initialData }: Props) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedCompanyProfile, setSelectedCompanyProfile] =
    useState<CompanyProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const handleCompanySelect = useCallback((companyId: number | null) => {
    setSelectedCompanyId(companyId);
    if (companyId === null) {
      setIsLoadingProfile(false);
      setSelectedCompanyProfile(null);
      return;
    }
    setIsLoadingProfile(true);
  }, []);

  useEffect(() => {
    if (selectedCompanyId === null) {
      return;
    }

    let isMounted = true;

    fetchCompanyProfile(selectedCompanyId)
      .then((profile) => {
        if (!isMounted) return;
        setSelectedCompanyProfile(profile);
      })
      .catch(() => {
        if (!isMounted) return;
        setSelectedCompanyProfile(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoadingProfile(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCompanyId]);

  return (
    <>
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
          onCompanySelect={handleCompanySelect}
        />
      </MuiContainer>

      <MuiContainer
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "stretch",
          gap: "1rem",
        }}
      >
        <CompanyDetails
          profile={selectedCompanyProfile}
          isLoading={isLoadingProfile}
        />
        <AuditLog profile={selectedCompanyProfile} isLoading={isLoadingProfile} />
      </MuiContainer>
    </>
  );
}
