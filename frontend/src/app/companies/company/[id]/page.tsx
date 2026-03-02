import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { CompanyProfilePanel } from "@/src/features/companies";
import { fetchCompanyProfile } from "@/src/lib/dashboardApi";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompanyPage({ params }: PageProps) {
  const { id } = await params;
  const companyId = Number(id);
  const profile = Number.isInteger(companyId)
    ? await fetchCompanyProfile(companyId)
    : null;

  if (!profile) {
    return (
      <>
        <MuiNavigation />
        <MuiContainer>
          <MuiHeader
            title="Company Not Found"
            subTitle="Company"
            buttonSlot={
              <Link href="/companies">
                <MuiButton variant="outlined">Back to Companies</MuiButton>
              </Link>
            }
          />
        </MuiContainer>
      </>
    );
  }

  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader
          title={profile.company.name}
          subTitle={`Company #${profile.company.id}`}
          buttonSlot={
            <Link href="/companies">
              <MuiButton variant="outlined">Back to Companies</MuiButton>
            </Link>
          }
        />
        <CompanyProfilePanel profile={profile} />
      </MuiContainer>
    </>
  );
}
