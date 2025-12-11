"use client";

import React from "react";
import { Button, CircularProgress } from "@mui/material";

interface SubmitButtonProps {
    isLoading: boolean;
    children: React.ReactNode;
    fullWidth?: boolean;
    size?: "small" | "medium" | "large";
    variant?: "text" | "outlined" | "contained";
    sx?: any;
}

export default function SubmitButton({
    isLoading,
    children,
    fullWidth = true,
    size = "large",
    variant = "contained",
    sx,
}: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            fullWidth={fullWidth}
            variant={variant}
            size={size}
            disabled={isLoading}
            sx={{
                mt: 3,
                mb: 2,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                ...sx,
            }}
        >
            {isLoading ? <CircularProgress size={24} /> : children}
        </Button>
    );
}
