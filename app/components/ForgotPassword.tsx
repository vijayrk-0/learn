'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    InputAdornment,
    Alert,
    CircularProgress,
    Link as MuiLink,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    EmailOutlined,
    LockOutlined,
    Visibility,
    VisibilityOff,
    PinOutlined,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type StepType = 'email' | 'otp' | 'password';

export default function ForgotPassword() {
    // Function to handle navigation
    const router = useRouter();

    // State variables
    const [activeStep, setActiveStep] = useState<StepType>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];


    // Function to handle sending OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Send OTP to user's email
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('OTP sent to your email. Please check your inbox.');
                setActiveStep('otp');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle verifying OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Verify OTP
        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('OTP verified! Please set your new password.');
                setActiveStep('password');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle resetting password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate password
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        // Reset password
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to get step index
    const getStepIndex = () => {
        switch (activeStep) {
            case 'email':
                return 0;
            case 'otp':
                return 1;
            case 'password':
                return 2;
            default:
                return 0;
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                width: '100%',
                padding: 2,
            }}
        >
            <Card
                sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
                        >
                            Forgot Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Reset your password in 3 simple steps
                        </Typography>
                    </Box>

                    {/* Stepper */}
                    <Stepper activeStep={getStepIndex()} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Alerts */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {/* Step 1: Email Input */}
                    {activeStep === 'email' && (
                        <Box component="form" onSubmit={handleSendOTP}>
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
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                            </Button>
                        </Box>
                    )}

                    {/* Step 2: OTP Verification */}
                    {activeStep === 'otp' && (
                        <Box component="form" onSubmit={handleVerifyOTP}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Please enter the 6-digit OTP sent to <strong>{email}</strong>
                            </Typography>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="otp"
                                label="Enter OTP"
                                name="otp"
                                autoFocus
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                inputProps={{
                                    maxLength: 6,
                                    pattern: '[0-9]*',
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
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
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
                            </Button>
                            <Button
                                fullWidth
                                variant="text"
                                size="small"
                                onClick={() => setActiveStep('email')}
                                sx={{ textTransform: 'none' }}
                            >
                                Change Email
                            </Button>
                        </Box>
                    )}

                    {/* Step 3: Reset Password */}
                    {activeStep === 'password' && (
                        <Box component="form" onSubmit={handleResetPassword}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="newPassword"
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
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
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                            </Button>
                        </Box>
                    )}

                    {/* Back to Login Link */}
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Remember your password?{' '}
                            <Link
                                href="/login"
                                style={{
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    color: 'inherit'
                                }}
                            >
                                <MuiLink
                                    component="span"
                                    underline="hover"
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Back to Login
                                </MuiLink>
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
