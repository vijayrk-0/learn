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
import { useLoginMutation } from "@/store/rtk/authRTK";
import { setAuth } from "@/store/slice/authSlice";
import { loginSchema } from "@/lib/validation-schema";
import * as yup from "yup";

import AuthCard from "@/app/(auth)/components/AuthCard";
import PasswordField from "@/app/(auth)/components/PasswordField";
import SubmitButton from "@/app/(auth)/components/SubmitButton";
import AuthFooter from "@/app/(auth)/components/AuthFooter";
import { resetPageState, setPageState } from "@/store/slice/pageStateSlice";
import { useSelector, useDispatch } from "react-redux";

export default function Login() {
    const dispatch = useDispatch();
    const pageState = useSelector(
        (state: { pageState: any }) => state.pageState.login
    );
    const router = useRouter();
    const [loginMutation, { isLoading }] = useLoginMutation();
    const [email, setEmail] = useState(pageState.email || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

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

        try {
            const result = await loginMutation({ email, password }).unwrap();
            dispatch(
                setAuth({
                    token: result?.data?.token,
                    user: result?.data?.user,
                })
            );
            dispatch(resetPageState("login"));
            router.push("/dashboard");
        } catch (err: any) {
            setError(
                err?.data?.message ||
                "Login failed. Please check your details and try again."
            );
        }
    };

    return (
        <AuthCard
            title="Welcome back"
            subtitle="Please sign in to continue"
        >
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                    mt: { xs: 0.5, sm: 1 },
                }}
            >
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: { xs: 1.5, sm: 2 },
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    placeholder="Email address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        dispatch(
                            setPageState({
                                page: "login",
                                data: { email: e.target.value, password },
                            })
                        );
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    sx={{
                                        pl: 1,
                                        pr: 1,
                                        color: "text.secondary",
                                    }}
                                >
                                    <EmailOutlined
                                        sx={{
                                            fontSize: { xs: "1rem", sm: "1.2rem" },
                                        }}
                                        color="action"
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        "& .MuiInputBase-input": {
                            fontSize: { xs: "0.875rem", sm: "0.95rem" },
                        },
                    }}
                />

                <PasswordField
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: { xs: 0.5, sm: 1 },
                    }}
                >
                    <Link
                        href="/forget-password"
                        variant="body2"
                        underline="hover"
                        sx={{
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                    >
                        Forgot your password?
                    </Link>
                </Box>

                <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                    <SubmitButton isLoading={isLoading}>Sign in</SubmitButton>
                </Box>

                <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                    <AuthFooter
                        text="Don't have an account yet?"
                        linkText="Sign up"
                        linkHref="/signup"
                    />
                </Box>
            </Box>
        </AuthCard>
    );
}
