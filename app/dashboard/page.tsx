'use client';

import React, { useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            <Dashboard />
        </Box>
    );
}
