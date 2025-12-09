'use client';

import  { useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store/store';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    // Function to handle navigation
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
