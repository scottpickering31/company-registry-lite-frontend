"use client";

import { Stack } from "@mui/material";
import MuiSelect from "@/src/components/layout/mui/MuiSelect";
import MuiTextField from "@/src/components/layout/mui/MuiTextField";
import { useEffect, useMemo, useState } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useDebounce } from "use-debounce";

type SelectConfig = {
  id: number;
  label: string;
  values: string[];
};

interface QueryInputProps {
  querySelectTitles: SelectConfig[];
  textFieldActive?: boolean;
  textFieldLabel?: string;
  debounceMs?: number;
  onQueryChange?: (next: {
    input: string;
    selectedById: Record<number, string>;
  }) => void;
}

export default function MuiQueryInput({
  querySelectTitles,
  textFieldLabel,
  textFieldActive = true,
  debounceMs = 5000,
  onQueryChange,
}: QueryInputProps) {
  const initialSelected = useMemo(() => {
    return Object.fromEntries(
      querySelectTitles.map((cfg) => [cfg.id, cfg.values[0] ?? ""]),
    ) as Record<number, string>;
  }, [querySelectTitles]);

  const [selectedById, setSelectedById] =
    useState<Record<number, string>>(initialSelected);
  const [input, setInput] = useState("");

  const [value] = useDebounce(input, debounceMs);

  useEffect(() => {
    setSelectedById(initialSelected);
  }, [initialSelected]);

  useEffect(() => {
    if (!onQueryChange) return;
    onQueryChange({ input: value, selectedById });
  }, [onQueryChange, selectedById, value]);

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
