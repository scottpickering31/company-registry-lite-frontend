"use client";

import MuiButton from "@/src/components/buttons/MuiButton";
import { Stack } from "@mui/material";
import Link from "next/link";
import { deleteCompany } from "@/src/lib/dashboardApi";
import { useGlobalAlertStore } from "@/src/store/globalAlert.store";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/src/lib/authSession";
import { useState } from "react";

interface ActionsButtonSetProps {
  view: string;
  editActive?: boolean;
  editHref?: string;
  deleteActive?: boolean;
  deleteCompanyId?: number;
}

export default function ActionsButtonSet({
  view,
  editActive = false,
  editHref = "/",
  deleteActive = false,
  deleteCompanyId,
}: ActionsButtonSetProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { setAlert } = useGlobalAlertStore();

  const onDelete = async () => {
    if (!deleteCompanyId || isDeleting) return;

    if (!getAuthToken()) {
      setAlert({
        severity: "error",
        message: "Please login before deleting a company",
      });
      router.push("/login");
      return;
    }

    const confirmed = window.confirm(
      "Delete this company? This will also remove related officers, filings, and audit logs.",
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteCompany(deleteCompanyId);
      setAlert({
        severity: "success",
        message: "Company deleted successfully.",
      });
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete company";
      setAlert({ severity: "error", message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} justifyContent={"center"}>
      <Link href={view}>
        <MuiButton actions>View</MuiButton>
      </Link>
      {editActive && (
        <Link href={editHref}>
          <MuiButton actions>Edit</MuiButton>
        </Link>
      )}
      {deleteActive && (
        <MuiButton actions onClick={onDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </MuiButton>
      )}
    </Stack>
  );
}
