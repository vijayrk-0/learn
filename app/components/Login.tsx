'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
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
import { Visibility, VisibilityOff, LockOutlined, EmailOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data using AuthContext
                login(data.token, data.user);
                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                setError(data.message || 'Login failed');
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
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sign in to continue
                            </Typography>
                        </Box>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                <Link href="#" variant="body2" underline="hover">
                                    Forgot password?
                                </Link>
                            </Box>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>
                            <Grid container justifyContent="center">
                                <Grid>
                                    <Typography variant="body2" color="text.secondary">
                                        Don't have an account?{' '}
                                        <Link href="/signup" variant="body2" underline="hover" sx={{ fontWeight: 'bold' }}>
                                            Sign Up
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
