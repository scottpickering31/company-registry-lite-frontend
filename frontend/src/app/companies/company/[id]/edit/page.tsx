"use client";

import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { fetchCompanyProfile, updateCompany } from "@/src/lib/dashboardApi";
import { getAuthToken } from "@/src/lib/authSession";
import { useGlobalAlertStore } from "@/src/store/globalAlert.store";
import { Box, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useMemo, useState } from "react";

type CompanyStatus = "Active" | "Dormant";

export default function EditCompanyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { setAlert } = useGlobalAlertStore();

  const companyId = Number(params?.id);
  const isValidCompanyId = Number.isInteger(companyId) && companyId > 0;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [status, setStatus] = useState<CompanyStatus>("Active");

  useEffect(() => {
    if (!isValidCompanyId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    fetchCompanyProfile(companyId)
      .then((profile) => {
        if (!isMounted || !profile) return;
        setName(String(profile.company.name ?? ""));
        setCompanyNumber(String(profile.company.companyNumber ?? ""));
        setStatus(
          String(profile.company.status).toLowerCase() === "dormant"
            ? "Dormant"
            : "Active",
        );
      })
      .catch(() => {
        if (!isMounted) return;
        setAlert({ severity: "error", message: "Failed to load company details." });
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [companyId, isValidCompanyId, setAlert]);

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting || isLoading || !name.trim() || !companyNumber.trim();
  }, [companyNumber, isLoading, isSubmitting, name]);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidCompanyId) {
      setAlert({ severity: "error", message: "Invalid company ID." });
      return;
    }

    if (!getAuthToken()) {
      setAlert({
        severity: "error",
        message: "Please login before editing a company",
      });
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateCompany(companyId, {
        name: name.trim(),
        companyNumber: companyNumber.trim(),
        status,
      });

      setAlert({
        severity: "success",
        message: "Company updated successfully.",
      });
      router.push(`/companies/company/${companyId}`);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update company";
      setAlert({ severity: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidCompanyId) {
    return (
      <>
        <MuiNavigation />
        <MuiContainer>
          <MuiHeader
            title="Invalid Company"
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
          title="Edit Company"
          subTitle={`Company #${companyId}`}
          buttonSlot={
            <Link href={`/companies/company/${companyId}`}>
              <MuiButton variant="outlined">Back</MuiButton>
            </Link>
          }
        />

        <Paper
          elevation={0}
          sx={{
            mt: "1rem",
            p: "1.5rem",
            borderRadius: "16px",
            border: "1px solid #e6e0d8",
            boxShadow: "0 18px 45px rgba(23, 22, 20, 0.12)",
          }}
        >
          <Typography variant="h6" sx={{ mb: "1rem", fontWeight: 700 }}>
            Update company details
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                label="Company Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Acme Holdings Ltd"
                sx={{ maxWidth: "560px" }}
                disabled={isLoading}
              />

              <TextField
                required
                label="Company Number"
                value={companyNumber}
                onChange={(event) => setCompanyNumber(event.target.value)}
                placeholder="12345678"
                sx={{ maxWidth: "560px" }}
                disabled={isLoading}
              />

              <TextField
                select
                label="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value as CompanyStatus)}
                sx={{ maxWidth: "560px" }}
                disabled={isLoading}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Dormant">Dormant</MenuItem>
              </TextField>

              <Box>
                <MuiButton type="submit" disabled={isSubmitDisabled}>
                  {isSubmitting ? "Saving..." : isLoading ? "Loading..." : "Save Changes"}
                </MuiButton>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </MuiContainer>
    </>
  );
}
