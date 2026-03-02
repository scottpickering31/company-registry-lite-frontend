"use client";

import MuiButton from "@/src/components/buttons/MuiButton";
import { loginRequest } from "@/src/lib/authApi";
import { saveAuthSession } from "@/src/lib/authSession";
import { useGlobalAlertStore } from "@/src/store/globalAlert.store";
import { Box, Link as MuiLink, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useMemo, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { setAlert } = useGlobalAlertStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting || !email.trim() || !password;
  }, [email, isSubmitting, password]);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = await loginRequest({
        email: email.trim(),
        password,
      });

      saveAuthSession(payload.token, payload.user);

      setAlert({
        severity: "success",
        message: `Welcome back, ${payload.user.fullName}`,
      });

      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setAlert({ severity: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "440px",
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e6e0d8",
          boxShadow: "0 18px 45px rgba(23, 22, 20, 0.12)",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Login
        </Typography>
        <Typography variant="body2" sx={{ color: "#5a5752", mb: 3 }}>
          Sign in to your Company Registry Lite account.
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              required
              type="email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              required
              type="password"
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <MuiButton type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </MuiButton>
          </Stack>
        </Box>

        <Typography sx={{ mt: 3, fontSize: "0.95rem" }}>
          New here?{" "}
          <MuiLink component={Link} href="/signup" underline="hover">
            Create an account
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
