"use client";

import MuiButton from "@/src/components/buttons/MuiButton";
import { signupRequest } from "@/src/lib/authApi";
import { saveAuthSession } from "@/src/lib/authSession";
import { useGlobalAlertStore } from "@/src/store/globalAlert.store";
import { Box, Link as MuiLink, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useMemo, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const { setAlert } = useGlobalAlertStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    return isSubmitting || !fullName.trim() || !email.trim() || password.length < 8;
  }, [email, fullName, isSubmitting, password]);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = await signupRequest({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      saveAuthSession(payload.token, payload.user);

      setAlert({
        severity: "success",
        message: `Account created for ${payload.user.fullName}`,
      });

      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
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
          Sign Up
        </Typography>
        <Typography variant="body2" sx={{ color: "#5a5752", mb: 3 }}>
          Create an account to start using Company Registry Lite.
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              required
              label="Full Name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
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
              helperText="At least 8 characters"
            />
            <MuiButton type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </MuiButton>
          </Stack>
        </Box>

        <Typography sx={{ mt: 3, fontSize: "0.95rem" }}>
          Already have an account?{" "}
          <MuiLink component={Link} href="/login" underline="hover">
            Sign in
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
