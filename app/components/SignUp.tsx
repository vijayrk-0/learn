'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
    Card,
    CardContent,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, EmailOutlined, PersonOutline } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Card
                    sx={{
                        minWidth: 275,
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
                            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Create Account
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sign up to get started
                            </Typography>
                        </Box>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutline color="action" />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                autoComplete="new-password"
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
                                                    aria-label="toggle confirm password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                                sx={{ mt: 3, mb: 2, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                            </Button>
                            <Grid container justifyContent="center">
                                <Grid>
                                    <Typography variant="body2" color="text.secondary">
                                        Already have an account?{' '}
                                        <Link href="/login" variant="body2" underline="hover" sx={{ fontWeight: 'bold' }}>
                                            Sign In
                                        </Link>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
