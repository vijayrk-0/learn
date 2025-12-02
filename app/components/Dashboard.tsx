'use client';

import React from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    Chip,
    Stack,
} from '@mui/material';
import { LogoutOutlined, VerifiedUser, Email, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <Container component="main" maxWidth="md">
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
                        width: '100%',
                        boxShadow: 3,
                        borderRadius: 2,
                        padding: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    bgcolor: 'primary.main',
                                    fontSize: '2rem',
                                }}
                            >
                                {user?.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Welcome, {user?.name}!
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                You are successfully logged in
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Account Information
                            </Typography>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Person color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Full Name
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {user?.name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Email color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Email Address
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {user?.email}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <VerifiedUser color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Account Status
                                        </Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Chip
                                                label={user?.verified ? 'Verified' : 'Not Verified'}
                                                color={user?.verified ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                color="error"
                                size="large"
                                startIcon={<LogoutOutlined />}
                                onClick={logout}
                                sx={{ borderRadius: 2, textTransform: 'none', fontSize: '1rem', minWidth: 150 }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
