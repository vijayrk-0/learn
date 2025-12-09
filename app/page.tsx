'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { Box, CircularProgress } from '@mui/material';

export default function Home() {

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // Check authentication status and redirect to appropriate page
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

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
      <CircularProgress />
    </Box>
  );
}