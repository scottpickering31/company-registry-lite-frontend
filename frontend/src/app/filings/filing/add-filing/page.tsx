"use client";

import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { fetchCompanyTable, fetchOfficerTable } from "@/src/lib/dashboardApi";
import { useGlobalAlertStore } from "@/src/store/globalAlert.store";
import {
  Box,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useMemo, useState } from "react";

type CompanyOption = {
  id: number;
  name: string;
};

type OfficerOption = {
  id: number;
  name: string;
  company: string;
};

type CreateFilingPayload = {
  companyId: number;
  type: string;
  description?: string;
  officerId?: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;
const COMPANY_TABLE_FETCH_LIMIT = 1000;

export default function AddFilingPage() {
  const router = useRouter();
  const { setAlert } = useGlobalAlertStore();

  const [companyId, setCompanyId] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [officers, setOfficers] = useState<OfficerOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async () => {
      try {
        const [companyData, officerData] = await Promise.all([
          fetchCompanyTable({
            page: 1,
            pageSize: COMPANY_TABLE_FETCH_LIMIT,
            sortBy: "Name",
          }),
          fetchOfficerTable(),
        ]);

        if (!isMounted) return;

        setCompanies(
          (companyData.rows ?? []).map((company) => ({
            id: company.id,
            name: company.name,
          })),
        );
        setOfficers(
          officerData.map((officer) => ({
            id: officer.id,
            name: officer.name,
            company: officer.company,
          })),
        );
      } catch {
        if (!isMounted) return;
        setAlert({
          severity: "error",
          message: "Failed to load filing form options",
        });
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false);
        }
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, [setAlert]);

  const selectedCompanyName = useMemo(() => {
    if (!companyId) return "";
    const company = companies.find((row) => row.id === Number(companyId));
    return company?.name ?? "";
  }, [companies, companyId]);

  const companyOfficers = useMemo(() => {
    if (!selectedCompanyName) return [];
    return officers.filter((officer) => officer.company === selectedCompanyName);
  }, [officers, selectedCompanyName]);

  const isSubmitDisabled = useMemo(() => {
    return (
      isSubmitting ||
      isLoadingOptions ||
      !companyId ||
      !type.trim() ||
      !file ||
      file.type !== "application/pdf"
    );
  }, [companyId, file, isLoadingOptions, isSubmitting, type]);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!API_BASE) {
      setAlert({
        severity: "error",
        message: "Missing NEXT_PUBLIC_API_URL in frontend .env.local",
      });
      return;
    }

    if (!file || file.type !== "application/pdf") {
      setAlert({
        severity: "error",
        message: "Please select a valid PDF file",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateFilingPayload = {
        companyId: Number(companyId),
        type: type.trim(),
        description: description.trim() || undefined,
        officerId: officerId ? Number(officerId) : undefined,
      };
      const formData = new FormData();
      formData.set("companyId", String(payload.companyId));
      formData.set("type", payload.type);
      if (payload.description) {
        formData.set("description", payload.description);
      }
      if (payload.officerId) {
        formData.set("officerId", String(payload.officerId));
      }
      formData.set("document", file);

      const response = await fetch(`${API_BASE}/api/dashboard/filings`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(data.message || "Failed to file document");
      }

      const created = (await response.json().catch(() => ({}))) as {
        id?: number;
      };

      setAlert({
        severity: "success",
        message: created.id
          ? `Filing #${created.id} submitted successfully.`
          : "Filing submitted successfully.",
      });

      router.push("/filings");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to file document";
      setAlert({ severity: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MuiNavigation />
      <MuiContainer>
        <MuiHeader
          title="File New Document"
          subTitle="Filings"
          buttonSlot={
            <Link href="/filings">
              <MuiButton variant="outlined">Back to Filings</MuiButton>
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
            Upload filing PDF
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                select
                label="Company"
                value={companyId}
                onChange={(event) => {
                  setCompanyId(event.target.value);
                  setOfficerId("");
                }}
                disabled={isLoadingOptions}
                helperText={isLoadingOptions ? "Loading companies..." : ""}
                sx={{ maxWidth: "560px" }}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={String(company.id)}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                required
                label="Type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                placeholder="Annual Accounts Submitted"
                sx={{ maxWidth: "560px" }}
              />

              <TextField
                label="Officer (optional)"
                select
                value={officerId}
                onChange={(event) => setOfficerId(event.target.value)}
                disabled={!companyId}
                helperText={
                  companyId
                    ? "Optional: assign an officer for this filing"
                    : "Select a company first"
                }
                sx={{ maxWidth: "560px" }}
              >
                <MenuItem value="">None</MenuItem>
                {companyOfficers.map((officer) => (
                  <MenuItem key={officer.id} value={String(officer.id)}>
                    {officer.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Description (optional)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                multiline
                minRows={3}
                sx={{ maxWidth: "560px" }}
              />

              <TextField
                required
                type="file"
                inputProps={{ accept: "application/pdf" }}
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null;
                  setFile(nextFile);
                }}
                helperText={
                  file
                    ? `Selected: ${file.name}`
                    : "Select a PDF file to upload"
                }
                sx={{ maxWidth: "560px" }}
              />

              <Box>
                <MuiButton type="submit" disabled={isSubmitDisabled}>
                  {isSubmitting ? "Submitting..." : "Submit Filing"}
                </MuiButton>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </MuiContainer>
    </>
  );
}
