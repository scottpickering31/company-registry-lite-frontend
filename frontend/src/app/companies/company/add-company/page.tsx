"use client";

import MuiButton from "@/src/components/buttons/MuiButton";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import MuiHeader from "@/src/components/layout/mui/MuiHeader";
import MuiNavigation from "@/src/components/layout/mui/MuiNavigation";
import { buildAuthHeaders, getAuthToken } from "@/src/lib/authSession";
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
import { SubmitEvent, useMemo, useState } from "react";

type CompanyStatus = "Active" | "Dormant";

type CreateCompanyPayload = {
  name: string;
  companyNumber: string;
  status: CompanyStatus;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;

export default function AddCompanyPage() {
  const router = useRouter();
  const { setAlert } = useGlobalAlertStore();

  const [name, setName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [status, setStatus] = useState<CompanyStatus>("Active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting || !name.trim() || !companyNumber.trim();
  }, [companyNumber, isSubmitting, name]);

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
        message: "Please login before creating a company",
      });
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    const payload: CreateCompanyPayload = {
      name: name.trim(),
      companyNumber: companyNumber.trim(),
      status,
    };

    try {
      const response = await fetch(`${API_BASE}/api/dashboard/companies`, {
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
        throw new Error(data.message || "Failed to add company");
      }

      setAlert({
        severity: "success",
        message: "Company added successfully.",
      });
      setName("");
      setCompanyNumber("");
      setStatus("Active");

      // router.back();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add company";
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
          title="Add Company"
          subTitle="Company"
          buttonSlot={
            <Link href="/">
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
            Enter company details
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
              />

              <TextField
                required
                label="Company Number"
                value={companyNumber}
                onChange={(event) => setCompanyNumber(event.target.value)}
                placeholder="12345678"
                sx={{ maxWidth: "560px" }}
              />

              <TextField
                select
                label="Status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as CompanyStatus)
                }
                sx={{ maxWidth: "560px" }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Dormant">Dormant</MenuItem>
              </TextField>

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
