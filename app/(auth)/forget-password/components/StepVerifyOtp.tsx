import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { PinOutlined } from '@mui/icons-material';

interface StepVerifyOtpProps {
    email: string;
    otp: string;
    onOtpChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onChangeEmail: () => void;
    loading: boolean;
}

const StepVerifyOtp: React.FC<StepVerifyOtpProps> = ({
    email,
    otp,
    onOtpChange,
    onSubmit,
    onChangeEmail,
    loading
}) => {
    return (
        <Box component="form" onSubmit={onSubmit}>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                Please enter the 6-digit OTP sent to <strong>{email}</strong>
            </Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                placeholder="Enter 6-digit OTP"
                name="otp"
                autoFocus
                value={otp}
                onChange={(e) => onOtpChange(e.target.value)}
                inputProps={{
                    maxLength: 6,
                    pattern: "[0-9]*",
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start" sx={{ pl: 1, pr: 1 }}>
                                <PinOutlined color="action" />
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
                disabled={loading || otp.length !== 6}
                sx={{
                    mt: 3,
                    mb: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                }}
            >
                {loading ? <CircularProgress size={24} /> : "Verify OTP"}
            </Button>
            <Button
                fullWidth
                variant="text"
                size="small"
                onClick={onChangeEmail}
                sx={{ textTransform: "none" }}
            >
                Change Email
            </Button>
        </Box>
    );
};

export default StepVerifyOtp;
