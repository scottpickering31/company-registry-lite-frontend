import { Divider } from "@mui/material";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";

interface HeaderProps {
  title: string;
  subTitle: string;
  buttonSlot?: React.ReactNode;
}

export default function MuiHeader({
  title,
  subTitle,
  buttonSlot,
}: HeaderProps) {
  return (
    <MuiContainer
      sx={{
        mt: "1rem",
        p: "1.25rem 1.5rem",
        borderRadius: "16px",
        border: "1px solid #e6e0d8",
        background:
          "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,245,240,1) 100%)",
        boxShadow: "0 18px 45px rgba(23, 22, 20, 0.12)",
      }}
    >
      <MuiContainer
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6b6157",
              marginBottom: "0.35rem",
            }}
          >
            {subTitle}
          </p>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {buttonSlot}
      </MuiContainer>

      <Divider sx={{ mt: "1rem" }} />
    </MuiContainer>
  );
}
