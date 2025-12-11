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

export default function SignUp() {
    const router = useRouter();
    const [signupApi, { isLoading }] = useSignupMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        // Client side validation
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

        // Server side validation
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
        // Auth Card wrapper
        <AuthCard title="Create Account" subtitle="Sign up to get started">
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {/* Error Alert */}
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

                {/* Name Input */}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutline color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />


                {/* Email Input */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlined color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Password Input */}
                <PasswordField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                />

                {/* Confirm Password Input */}
                <PasswordField
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                />

                <SubmitButton isLoading={isLoading}>Sign Up</SubmitButton>

                <AuthFooter
                    text="Already have an account?"
                    linkText="Sign In"
                    linkHref="/login"
                />
            </Box>
        </AuthCard>
    );
}
