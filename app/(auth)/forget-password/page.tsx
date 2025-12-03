import React from 'react';
import ForgotPassword from '../../components/ForgotPassword';
import { Box } from '@mui/material';

export default function ForgotPasswordPage() {
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
            <ForgotPassword />
        </Box>
    );
}
