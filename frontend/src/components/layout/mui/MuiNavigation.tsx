"use client";

import AppBar from "@mui/material/AppBar";
import MuiNavigationRoute from "@/src/components/layout/mui/MuiNavigationRoute";
import { navItems } from "@/src/constants/NavItems";
import {
  clearAuthSession,
  getAuthUser,
  subscribeAuthSession,
} from "@/src/lib/authSession";
import { usePathname, useRouter } from "next/navigation";
import MuiContainer from "@/src/components/layout/mui/MuiContainer";
import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";

export default function MuiNavigation() {
  const path = usePathname();
  const router = useRouter();
  const displayName = useSyncExternalStore(
    subscribeAuthSession,
    () => getAuthUser()?.fullName ?? "",
    () => "",
  );

  const userInitial = useMemo(() => {
    const firstChar = displayName.trim()[0];
    return firstChar ? firstChar.toUpperCase() : "";
  }, [displayName]);

  const onLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: "1px solid #e6e0d8",
        color: "#ffffff",
      }}
    >
      <MuiContainer>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="relative pl-40 min-h-[150px] flex items-center">
            <Image
              src="/images/company-registry-lite-favicon.png"
              alt="logo"
              width={200}
              height={200}
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <div>
              <p
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#ffffff",
                  marginBottom: "0.2rem",
                }}
              >
                Workspace
              </p>
              <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>
                Company Registry Lite
              </h1>
            </div>
          </div>
          <div className="flex flex-row items-center gap-10">
            {navItems.map((routes, index) => {
              return (
                <MuiNavigationRoute
                  key={index}
                  NavRoute={routes.route}
                  NavTitle={routes.title}
                  DividerActive={path === routes.route}
                />
              );
            })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "999px",
                  backgroundColor: "#efe7dc",
                  border: "1px solid #e2dbd2",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  color: "#3f3a33",
                }}
              >
                {userInitial}
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  Signed In
                </p>
                <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>
                  {displayName || " "}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="cursor-pointer"
              style={{
                border: "1px solid #d8cfc3",
                padding: "0.45rem 0.85rem",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                backgroundColor: "#ffffff",
                color: "#3f3a33",
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </MuiContainer>
    </AppBar>
  );
}
