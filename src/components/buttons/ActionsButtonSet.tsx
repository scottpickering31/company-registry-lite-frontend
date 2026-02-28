import React from "react";
import MuiButton from "@/src/components/buttons/MuiButton";
import { Stack } from "@mui/material";
import Link from "next/link";

interface ActionsButtonSetProps {
  view: string;
  editActive: boolean;
}

export default function ActionsButtonSet({
  view,
  editActive,
}: ActionsButtonSetProps) {
  return (
    <Stack direction="row" spacing={2} justifyContent={"center"}>
      <Link href={view}>
        <MuiButton actions>View</MuiButton>
      </Link>
      {editActive && (
        <Link href="/">
          <MuiButton actions>Edit</MuiButton>
        </Link>
      )}
      <MuiButton actions>Delete</MuiButton>
    </Stack>
  );
}
