import Link from "next/link";
import Divider from "@mui/material/Divider";

interface NavigationRoutesProps {
  NavRoute: string;
  NavTitle: string;
  DividerActive: boolean;
}

export default function MuiNavigationRoutes({
  NavRoute,
  NavTitle,
  DividerActive,
}: NavigationRoutesProps) {
  return (
    <>
      <Link
        href={NavRoute}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: "0.35rem",
          textDecoration: "none",
          color: "#ffffff",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: DividerActive ? 800 : 600,
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          {NavTitle}
        </h2>
        {DividerActive && (
          <Divider
            style={{
              backgroundColor: "#ffffff",
              height: "3px",
              borderRadius: "999px",
              width: "100%",
            }}
          />
        )}
      </Link>
    </>
  );
}
