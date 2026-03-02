"use client";

import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { buildAuthHeaders, getAuthToken } from "@/src/lib/authSession";
import { useGlobalAlertStore } from "@/src/store/globalAlert.store";
import { fetchCompanyTable } from "@/src/lib/dashboardApi";
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

type CreateOfficerPayload = {
  name: string;
  companyId: number;
  role: string;
  appointed: string;
  resigned?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;
const COMPANY_TABLE_FETCH_LIMIT = 1000;

export default function AddOfficerPage() {
  const router = useRouter();
  const { setAlert } = useGlobalAlertStore();

  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("");
  const [appointed, setAppointed] = useState("");
  const [resigned, setResigned] = useState("");
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCompanies = async () => {
      try {
        const data = await fetchCompanyTable({
          page: 1,
          pageSize: COMPANY_TABLE_FETCH_LIMIT,
          sortBy: "Name",
        });

        if (!isMounted) return;

        const options = (data.rows ?? []).map((company) => ({
          id: company.id,
          name: company.name,
        }));
        setCompanies(options);
      } catch {
        if (!isMounted) return;
        setAlert({
          severity: "error",
          message: "Failed to load companies for officer assignment",
        });
      } finally {
        if (isMounted) {
          setIsLoadingCompanies(false);
        }
      }
    };

    loadCompanies();

    return () => {
      isMounted = false;
    };
  }, [setAlert]);

  const isSubmitDisabled = useMemo(() => {
    return (
      isSubmitting ||
      isLoadingCompanies ||
      !name.trim() ||
      !role.trim() ||
      !appointed ||
      !companyId
    );
  }, [appointed, companyId, isLoadingCompanies, isSubmitting, name, role]);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!API_BASE) {
      setAlert({
        severity: "error",
        message: "Missing NEXT_PUBLIC_API_URL in frontend .env.local",
      });
      return;
    }
    if (!getAuthToken()) {
      setAlert({
        severity: "error",
        message: "Please login before creating an officer",
      });
      router.push("/login");
      return;
    }

    if (resigned && resigned < appointed) {
      setAlert({
        severity: "error",
        message: "Resigned date cannot be before appointed date",
      });
      return;
    }

    setIsSubmitting(true);

    const payload: CreateOfficerPayload = {
      name: name.trim(),
      companyId: Number(companyId),
      role: role.trim(),
      appointed,
      resigned: resigned || undefined,
    };

    try {
      const response = await fetch(`${API_BASE}/api/dashboard/officers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(data.message || "Failed to add officer");
      }

      const createdOfficer = (await response.json().catch(() => ({}))) as {
        id?: number;
      };

      setAlert({
        severity: "success",
        message: createdOfficer.id
          ? `Officer #${createdOfficer.id} added successfully.`
          : "Officer added successfully.",
      });

      setName("");
      setCompanyId("");
      setRole("");
      setAppointed("");
      setResigned("");

      router.push("/officers");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add officer";
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
          title="Add Officer"
          subTitle="Officer"
          buttonSlot={
            <Link href="/officers">
              <MuiButton variant="outlined">Back to Officers</MuiButton>
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
            Enter officer details
          </Typography>

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Officer ID"
                value="Auto-generated"
                disabled
                sx={{ maxWidth: "560px" }}
              />

              <TextField
                required
                label="Officer Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Smith"
                sx={{ maxWidth: "560px" }}
              />

              <TextField
                required
                select
                label="Company Name"
                value={companyId}
                onChange={(event) => setCompanyId(event.target.value)}
                disabled={isLoadingCompanies}
                helperText={
                  isLoadingCompanies
                    ? "Loading companies..."
                    : "Select the company this officer belongs to"
                }
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
                label="Role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Director"
                sx={{ maxWidth: "560px" }}
              />

              <TextField
                required
                label="Appointed"
                type="date"
                value={appointed}
                onChange={(event) => setAppointed(event.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: "560px" }}
              />

              <TextField
                label="Resigned"
                type="date"
                value={resigned}
                onChange={(event) => setResigned(event.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="Optional"
                sx={{ maxWidth: "560px" }}
              />

              <Box>
                <MuiButton type="submit" disabled={isSubmitDisabled}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </MuiButton>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </MuiContainer>
    </>
  );
}
