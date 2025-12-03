import React from 'react';
import SignUp from '../../components/SignUp';
import { Box } from '@mui/material';

export default function SignUpPage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <SignUp />
        </Box>
    );
}
