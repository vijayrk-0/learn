'use client';

import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm" sx={{ mt: 8 }}>
                    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                        <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            We're sorry for the inconvenience. The application encountered an unexpected error.
                        </Typography>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: 'grey.100',
                                    borderRadius: 1,
                                    textAlign: 'left',
                                }}
                            >
                                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {this.state.error.toString()}
                                    {this.state.error.stack && `\n${this.state.error.stack}`}
                                </Typography>
                            </Box>
                        )}
                        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button variant="contained" onClick={this.handleReset}>
                                Try Again
                            </Button>
                            <Button variant="outlined" onClick={() => window.location.href = '/'}>
                                Go Home
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            );
        }

        return this.props.children;
    }
}
