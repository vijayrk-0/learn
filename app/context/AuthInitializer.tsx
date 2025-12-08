'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initAuth } from '@/app/store/authSlice';
import type { AppDispatch, RootState } from '@/app/store/store';
import { Box, CircularProgress } from '@mui/material';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    // Show loading while auth state is being restored from localStorage
    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
}
