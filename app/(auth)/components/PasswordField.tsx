"use client";

import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";

interface PasswordFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    id?: string;
    name?: string;
    autoComplete?: string;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    margin?: "none" | "dense" | "normal";
    required?: boolean;
}

export default function PasswordField({
    value,
    onChange,
    label = "Password",
    id = "password",
    name = "password",
    autoComplete = "current-password",
    error,
    helperText,
    fullWidth = true,
    margin = "normal",
    required = true,
}: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    return (
        <TextField
            margin={margin}
            required={required}
            fullWidth={fullWidth}
            name={name}
            label={label}
            type={showPassword ? "text" : "password"}
            id={id}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockOutlined color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}
