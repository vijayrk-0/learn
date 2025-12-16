import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    CircularProgress
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

interface StepResetPasswordProps {
    newPassword: string;
    onNewPasswordChange: (value: string) => void;
    confirmPassword: string;
    onConfirmPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

const StepResetPassword: React.FC<StepResetPasswordProps> = ({
    newPassword,
    onNewPasswordChange,
    confirmPassword,
    onConfirmPasswordChange,
    onSubmit,
    loading
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Box component="form" onSubmit={onSubmit}>
            <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                name="newPassword"
                placeholder="New password"
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
                sx={{
                    "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", sm: "0.95rem" },
                    },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start" sx={{ pl: 1, pr: 1 }}>
                                <LockOutlined
                                    color="action"
                                    sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                                />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    size="small"
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                        },
                                        px: 2,
                                    }}
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                name="confirmPassword"
                placeholder="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                sx={{
                    "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", sm: "0.95rem" },
                    },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start" sx={{ pl: 1, pr: 1 }}>
                                <LockOutlined
                                    color="action"
                                    sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                                />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    edge="end"
                                    size="small"
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "action.hover",
                                        },
                                        px: 2,
                                    }}
                                >
                                    {showConfirmPassword ? (
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
            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                }}
            >
                {loading ? <CircularProgress size={24} /> : "Reset Password"}
            </Button>
        </Box>
    );
};

export default StepResetPassword;
