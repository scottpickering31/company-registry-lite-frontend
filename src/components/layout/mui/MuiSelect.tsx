"use client";

import {
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  Stack,
} from "@mui/material";
import { useId } from "react";

type Option = { label: string; value: string };

type MuiSelectProps = Omit<SelectProps<string>, "children"> & {
  inputLabelValue: string;
  options: Option[];
};

export default function MuiSelect({
  inputLabelValue,
  options,
  ...selectProps
}: MuiSelectProps) {
  const labelId = useId();

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <InputLabel id={labelId} sx={{ fontWeight: "bold", fontSize: "18px" }}>
        {inputLabelValue}
      </InputLabel>
      <Select {...selectProps} sx={{ width: "15rem" }}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
