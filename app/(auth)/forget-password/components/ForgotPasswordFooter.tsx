import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const ForgotPasswordFooter: React.FC = () => {
    return (
        <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
                Remember your password?{" "}
                <Link
                    href="/login"
                    style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                        color: "inherit",
                    }}
                >
                    <MuiLink
                        component="span"
                        underline="hover"
                        sx={{ fontWeight: "bold" }}
                    >
                        Back to Login
                    </MuiLink>
                </Link>
            </Typography>
        </Box>
    );
};

export default ForgotPasswordFooter;
