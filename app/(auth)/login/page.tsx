"use client";

import React, { useState } from "react";
import {
    Box,
    Link,
    TextField,
    InputAdornment,
    Alert,
} from "@mui/material";
import { EmailOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/rtk/authRTK";
import { setAuth } from "@/store/slice/authSlice";
import { loginSchema } from "@/lib/validation-schema";
import * as yup from "yup";

import AuthCard from "@/app/(auth)/components/AuthCard";
import PasswordField from "@/app/(auth)/components/PasswordField";
import SubmitButton from "@/app/(auth)/components/SubmitButton";
import AuthFooter from "@/app/(auth)/components/AuthFooter";

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    // Login mutation
    const [loginMutation, { isLoading }] = useLoginMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        // Login client side validation
        try {
            await loginSchema.validate({ email, password });
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                setError(error.message);
                return;
            }
            setError("An unexpected error occurred. Please try again.");
            return;
        }

        // Login server side validation
        try {
            const result = await loginMutation({ email, password }).unwrap();
            dispatch(setAuth({ token: result.token, user: result.user }));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        // Login Wrapper    
        <AuthCard title="Welcome Back" subtitle="Sign in to continue">
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                {/* Error Alert message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {/* Email Input */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
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
                />
                {/* Forgot Password Link */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                    <Link href="/forget-password" variant="body2" underline="hover">
                        Forgot password?
                    </Link>
                </Box>
                {/* Submit Button */}
                <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>
                {/* Auth Footer */}
                <AuthFooter
                    text="Don't have an account?"
                    linkText="Sign Up"
                    linkHref="/signup"
                />
            </Box>
        </AuthCard>
    );
}
