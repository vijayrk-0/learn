"use client";

import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";

interface PasswordFieldProps
  extends Omit<
    TextFieldProps,
    | "type"
    | "onChange"
    | "value"
    | "InputProps"
    | "inputProps"
    | "slotProps"
  > {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordField({
  value,
  onChange,
  placeholder = "Password",
  id = "password",
  name = "password",
  autoComplete = "current-password",
  error,
  helperText,
  fullWidth = true,
  margin = "normal",
  required = true,
  ...rest
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
      id={id}
      name={name}
      placeholder={placeholder}
      autoComplete={autoComplete}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      {...rest}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{
                px: 1,
                color: "text.secondary",
              }}
            >
              <LockOutlined color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={handleTogglePasswordVisibility}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="small"
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  px: 2,
                }}
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
