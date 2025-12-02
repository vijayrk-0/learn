import React from 'react';
import Login from '../components/Login';
import { Box } from '@mui/material';

export default function LoginPage() {
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
            <Login />
        </Box>
    );
}
