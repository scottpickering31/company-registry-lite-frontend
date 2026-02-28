import { TextField, TextFieldProps } from "@mui/material";

export default function MuiTextField(props: TextFieldProps) {
  return <TextField variant="outlined" sx={{ width: "35rem" }} {...props} />;
}
