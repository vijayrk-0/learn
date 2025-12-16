"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import { EmailOutlined, PersonOutline } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/lib/validation-schema";
import * as yup from "yup";
import { useSignupMutation } from "@/store/rtk/authRTK";

import AuthCard from "@/app/(auth)/components/AuthCard";
import PasswordField from "@/app/(auth)/components/PasswordField";
import SubmitButton from "@/app/(auth)/components/SubmitButton";
import AuthFooter from "@/app/(auth)/components/AuthFooter";
import { resetAllPages, resetPageState, setPageState } from "@/store/slice/pageStateSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignUp() {
  const dispatch = useDispatch();
  const pageState = useSelector((state: { pageState: any; }) => state.pageState.signup);
  const router = useRouter();
  const [signupApi, { isLoading }] = useSignupMutation();
  const [name, setName] = useState(pageState.name);
  const [email, setEmail] = useState(pageState.email);
  const [password, setPassword] = useState(pageState.password);
  const [confirmPassword, setConfirmPassword] = useState(pageState.confirmPassword);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await signupSchema.validate({
        name,
        email,
        password,
        confirmPassword,
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setError(error.message);
        return;
      }
      setError("An unexpected error occurred. Please try again.");
      return;
    }

    try {
      await signupApi({
        name,
        email,
        password,
      }).unwrap();

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || "Registration failed";
      setError(msg);
    }
  };

  return (
    <AuthCard title="Create account" subtitle="Please sign up to get started">
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Name */}
        <TextField
          margin="dense"
          size="small"
          required
          fullWidth
          id="name"
          placeholder="Full name"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            dispatch(setPageState({ page: "signup", data: { name: e.target.value, email: email, password: password, confirmPassword: confirmPassword } }))
          }}
          sx={{
            "& .MuiInputBase-input": {
              fontSize: { xs: "0.875rem", sm: "0.95rem" },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ pl: 1, pr: 1 }}
                >
                  <PersonOutline
                    color="action"
                    sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Email */}
        <TextField
          margin="dense"
          size="small"
          required
          fullWidth
          id="email"
          placeholder="Email address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            dispatch(setPageState({ page: "signup", data: { name: name, email: e.target.value, password: password, confirmPassword: confirmPassword } }))
          }}
          sx={{
            "& .MuiInputBase-input": {
              fontSize: { xs: "0.875rem", sm: "0.95rem" },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ pl: 1, pr: 1 }}
                >
                  <EmailOutlined
                    color="action"
                    sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Password */}
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Password"
          size="small"
          margin="dense"
        />

        {/* Confirm Password */}
        <PasswordField
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          size="small"
          margin="dense"
        />

        <SubmitButton isLoading={isLoading}>Sign up</SubmitButton>

        <AuthFooter
          text="Already have an account?"
          linkText="Sign in"
          linkHref="/login"
        />
      </Box>
    </AuthCard>
  );
}
