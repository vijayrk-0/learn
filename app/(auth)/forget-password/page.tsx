"use client";

import React, { useState } from "react";
import {
    Box,
    Alert,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
    emailField as emailSchema,
    otpField as otpSchema,
    resetPasswordSchema,
} from "@/lib/validation-schema";
import * as yup from "yup";
import {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
} from "@/store/rtk/forgetPasswordRTK";

import AuthCard from "@/app/(auth)/components/AuthCard";
import StepRequestOtp from "@/app/(auth)/forget-password/components/StepRequestOtp";
import StepVerifyOtp from "@/app/(auth)/forget-password/components/StepVerifyOtp";
import StepResetPassword from "@/app/(auth)/forget-password/components/StepResetPassword";
import ForgotPasswordFooter from "@/app/(auth)/forget-password/components/ForgotPasswordFooter";

type StepType = "email" | "otp" | "password";

export default function ForgotPassword() {
    const router = useRouter();

    // RTK Query mutations
    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
    const [resetPasswordApi, { isLoading: isResetting }] =
        useResetPasswordMutation();

    const [activeStep, setActiveStep] = useState<StepType>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const steps = ["Enter Email", "Verify OTP", "Reset Password"];

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await emailSchema.validate(email);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setError(err.message);
                return;
            }
            setError("An error occurred. Please try again.");
            return;
        }

        try {
            await sendOtp({ email }).unwrap();
            setSuccess("OTP sent to your email. Please check your inbox.");
            setActiveStep("otp");
        } catch (err: any) {
            const msg = err?.data?.message || err?.error || "Failed to send OTP";
            setError(msg);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await otpSchema.validate(otp);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setError(err.message);
                return;
            }
            setError("An error occurred. Please try again.");
            return;
        }

        try {
            await verifyOtp({ email, otp }).unwrap();
            setSuccess("OTP verified! Please set your new password.");
            setActiveStep("password");
        } catch (err: any) {
            const msg = err?.data?.message || err?.error || "Invalid OTP";
            setError(msg);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await resetPasswordSchema.validate({
                password: newPassword,
                confirmPassword: confirmPassword,
            });
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setError(err.message);
                return;
            }
            setError("An error occurred. Please try again.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            await resetPasswordApi({
                email,
                otp,
                newPassword,
            }).unwrap();
            setSuccess("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            const msg =
                err?.data?.message || err?.error || "Failed to reset password";
            setError(msg);
        }
    };

    // Helper to get step index
    const getStepIndex = () => {
        switch (activeStep) {
            case "email": return 0;
            case "otp": return 1;
            case "password": return 2;
            default: return 0;
        }
    };

    const loading = isSendingOtp || isVerifyingOtp || isResetting;

    return (
        <AuthCard title="Forgot Password" subtitle="Reset your password in 3 simple steps">
            <Stepper activeStep={getStepIndex()} sx={{ mb: 4, width: '100%' }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {error && (
                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                    {success}
                </Alert>
            )}

            <Box sx={{ width: '100%' }}>
                {activeStep === "email" && (
                    <StepRequestOtp
                        email={email}
                        onEmailChange={setEmail}
                        onSubmit={handleSendOTP}
                        loading={loading}
                    />
                )}

                {activeStep === "otp" && (
                    <StepVerifyOtp
                        email={email}
                        otp={otp}
                        onOtpChange={setOtp}
                        onSubmit={handleVerifyOTP}
                        onChangeEmail={() => setActiveStep("email")}
                        loading={loading}
                    />
                )}

                {activeStep === "password" && (
                    <StepResetPassword
                        newPassword={newPassword}
                        onNewPasswordChange={setNewPassword}
                        confirmPassword={confirmPassword}
                        onConfirmPasswordChange={setConfirmPassword}
                        onSubmit={handleResetPassword}
                        loading={loading}
                    />
                )}

                <ForgotPasswordFooter />
            </Box>
        </AuthCard>
    );
}
