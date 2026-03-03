"use client";

import MuiButton from "@/src/components/buttons/MuiButton";
import { deleteOfficer } from "@/src/lib/dashboardApi";
import { getAuthToken } from "@/src/lib/authSession";
import { useGlobalAlertStore } from "@/src/store/globalAlert.store";
import { Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  officerId: number;
  viewHref: string;
  onDeleted?: () => void;
  showView?: boolean;
  redirectTo?: string;
};

export default function OfficerActionsButtonSet({
  officerId,
  viewHref,
  onDeleted,
  showView = true,
  redirectTo,
}: Props) {
  const router = useRouter();
  const { setAlert } = useGlobalAlertStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    if (isDeleting) return;

    if (!getAuthToken()) {
      setAlert({
        severity: "error",
        message: "Please login before deleting an officer",
      });
      router.push("/login");
      return;
    }

    const confirmed = window.confirm(
      "Delete this officer? Related records will be retained where allowed by the database.",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteOfficer(officerId);
      setAlert({ severity: "success", message: "Officer deleted successfully." });
      onDeleted?.();
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete officer";
      setAlert({ severity: "error", message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} justifyContent={"center"}>
      {showView ? (
        <Link href={viewHref}>
          <MuiButton actions>View</MuiButton>
        </Link>
      ) : null}
      <MuiButton actions onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </MuiButton>
    </Stack>
  );
}
