import React from 'react';
import {
    Box,
    TextField,
    Button,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { EmailOutlined } from '@mui/icons-material';

interface StepRequestOtpProps {
    email: string;
    onEmailChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

const StepRequestOtp: React.FC<StepRequestOtpProps> = ({
    email,
    onEmailChange,
    onSubmit,
    loading
}) => {
    return (
        <Box component="form" onSubmit={onSubmit}>
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
                onChange={(e) => onEmailChange(e.target.value)}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start" sx={{ pl: 1, pr: 1 }}>
                                <EmailOutlined color="action" />
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
                {loading ? <CircularProgress size={24} /> : "Send OTP"}
            </Button>
        </Box>
    );
};

export default StepRequestOtp;
