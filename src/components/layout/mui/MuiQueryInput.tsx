"use client";

import { Stack } from "@mui/material";
import MuiSelect from "@/src/components/layout/mui/MuiSelect";
import MuiTextField from "@/src/components/layout/mui/MuiTextField";
import { useMemo, useState } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useDebounce } from "use-debounce";
import { useInputStore } from "@/src/store/input.store";

type SelectConfig = {
  id: number;
  label: string;
  values: string[];
};

interface QueryInputProps {
  querySelectTitles: SelectConfig[];
  textFieldActive?: boolean;
  textFieldLabel?: string;
}

export default function MuiQueryInput({
  querySelectTitles,
  textFieldLabel,
  textFieldActive = true,
}: QueryInputProps) {
  // Memoising values as initial state - because we may not know the number of Selects at compile time
  const initialSelected = useMemo(() => {
    return Object.fromEntries(
      querySelectTitles.map((cfg) => [cfg.id, cfg.values[0] ?? ""]),
    ) as Record<number, string>;
  }, [querySelectTitles]);

  // Store the MUIselected values in state
  const [selectedById, setSelectedById] =
    useState<Record<number, string>>(initialSelected);
  const { input, setInput } = useInputStore();

  // Store the debounced selected values in state - to avoid unnecessary re-renders
  const [value] = useDebounce(input, 5000);

  // storing the selected values and updating the state
  const handleSelectChange = (id: number) => (e: SelectChangeEvent<string>) => {
    const nextValue = e.target.value;
    setSelectedById((prev) => ({ ...prev, [id]: nextValue }));
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div
      className="mt-5"
      style={{
        borderRadius: "16px",
        border: "1px solid #e6e0d8",
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,245,240,1) 100%)",
        boxShadow: "0 18px 45px rgba(23, 22, 20, 0.12)",
        padding: "1.25rem 1.5rem",
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        sx={{ flexWrap: "wrap" }}
      >
        {textFieldActive && (
          <MuiTextField
            label={textFieldLabel}
            onChange={handleTextFieldChange}
            value={input}
          />
        )}

        {querySelectTitles.map((cfg) => (
          <MuiSelect
            key={cfg.id}
            inputLabelValue={cfg.label}
            options={cfg.values.map((v) => ({ label: v, value: v }))}
            value={selectedById[cfg.id] ?? cfg.values[0] ?? ""}
            onChange={handleSelectChange(cfg.id)}
          />
        ))}
      </Stack>
    </div>
  );
}
