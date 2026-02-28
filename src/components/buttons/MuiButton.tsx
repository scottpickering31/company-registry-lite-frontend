import Button, { ButtonProps } from "@mui/material/Button";

interface MuiButtonProps extends ButtonProps {
  actions?: boolean;
}

export default function MuiButton({
  children,
  actions,
  ...props
}: MuiButtonProps) {
  return (
    <Button
      {...props}
      variant={actions ? "outlined" : "contained"}
      sx={
        actions
          ? {
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
              color: "#435ca1",
              backgroundColor: "#f0f0f0",
            }
          : {
              fontSize: "16px",
              paddingX: "18px",
              paddingY: "8px",
              fontWeight: "bold",
              textTransform: "none",
            }
      }
    >
      {children}
    </Button>
  );
}
