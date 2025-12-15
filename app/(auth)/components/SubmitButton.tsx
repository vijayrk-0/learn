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
                mt: { xs: 2, sm: 3 },
                mb: { xs: 1.5, sm: 2 },
                py: { xs: 1.1, sm: 1.5 },
                borderRadius: 2,
                textTransform: "none",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 600,
                letterSpacing: "0.02em",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-1px)",
                },
                "&:active": {
                    transform: "translateY(0)",
                },
                "&.Mui-disabled": {
                    backgroundColor: "action.disabledBackground",
                    color: "action.disabled",
                },
                ...sx,
            }}
        >
            {isLoading ? (
                <CircularProgress
                    size={22}
                    color="inherit"
                    sx={{ opacity: 0.8 }}
                />
            ) : (
                children
            )}
        </Button>
    );
}
