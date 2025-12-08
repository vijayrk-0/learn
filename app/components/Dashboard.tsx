'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Avatar,
    Chip,
    Grid,
    CircularProgress,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    LogoutOutlined,
    CheckCircle,
    Warning,
    Refresh,
} from '@mui/icons-material';

// TypeScript interfaces for type safety
interface DashboardData {
    meta: {
        environment: string;
        generatedAt: string;
        timeRange: string;
    };
    summary: {
        totalApis: number;
        totalRequests: number;
        avgLatencyMs: number;
        errorRatePercent: number;
        activeConsumers: number;
    };
    kpis: Array<{
        id: string;
        label: string;
        value: number;
        unit?: string;
        changePercent: number;
        trend: 'up' | 'down';
    }>;
    topApis: Array<{
        name: string;
        version: string;
        method: string;
        path: string;
        status: 'healthy' | 'degraded' | 'down';
        requests: number;
        errorRatePercent: number;
        p95LatencyMs: number;
        ownerTeam: string;
    }>;
    alerts: Array<{
        id: string;
        severity: 'high' | 'medium' | 'low';
        title: string;
        message: string;
        metric: string;
        api: string;
        triggeredAt: string;
        status: 'firing' | 'resolved';
    }>;
    topConsumers: Array<{
        name: string;
        type: string;
        requests: number;
        errorRatePercent: number;
        lastSeen: string;
    }>;
}

// Importing logout action and useDispatch
import { logout } from '@/app/store/authSlice';
import { useDispatch } from 'react-redux';

export default function Dashboard() {
    // Using useDispatch to dispatch actions
    const dispatch = useDispatch();
    
    // Using useState to manage state
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/dashboard');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: DashboardData = await response.json();
            setDashboardData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch dashboard data on mount
        fetchDashboardData();
    }, []);

    // Helper functions
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'success';
            case 'degraded': return 'warning';
            case 'down': return 'error';
            default: return 'default';
        }
    };

    // Helper function to get severity color
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    // Helper function to format numbers
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Loading state
    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    // Error state
    if (error || !dashboardData) {
        return (
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={fetchDashboardData}>
                            Retry
                        </Button>
                    }
                >
                    {error || 'No dashboard data available'}
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 8 }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    px: 4,
                    py: 2,
                    mb: 4,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                }}
            >
                <Container maxWidth="xl">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h5" fontWeight="800" color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                                API Analytics
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                                <Chip
                                    label={dashboardData.meta.environment.toUpperCase()}
                                    size="small"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.7rem',
                                        height: 24,
                                        bgcolor: 'primary.main',
                                        color: 'white'
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                    {dashboardData.meta.timeRange} • Updated {new Date(dashboardData.meta.generatedAt).toLocaleTimeString()}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Button
                                startIcon={<Refresh />}
                                onClick={fetchDashboardData}
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                            >
                                Refresh
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<LogoutOutlined />}
                                onClick={()=>{
                                    dispatch(logout());
                                }}
                                size="small"
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Paper>
            {/* Main Content */}
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {/* Left Column - Alerts & Top APIs */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        {/* Alerts Section */}
                        {dashboardData.alerts.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" fontWeight="800" gutterBottom>
                                    System Alerts
                                </Typography>
                                {/* Alerts Grid */}
                                <Grid container spacing={2}>
                                    {dashboardData.alerts.map((alert) => (
                                        <Grid size={12} key={alert.id}>
                                            <Alert
                                                severity={getSeverityColor(alert.severity) as any}
                                                sx={{ alignItems: 'center' }}
                                                icon={alert.status === 'resolved' ? <CheckCircle /> : <Warning />}
                                                action={
                                                    <Chip
                                                        label={alert.status.toUpperCase()}
                                                        size="small"
                                                        color={alert.status === 'resolved' ? 'success' : 'warning'}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                                    />
                                                }
                                            >
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {alert.title}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {alert.message} • <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{alert.api}</Box>
                                                    </Typography>
                                                </Box>
                                            </Alert>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {/* Top APIs Table */}
                        <Paper
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight="800" color="text.primary">
                                    Top APIs
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Performance metrics by endpoint
                                </Typography>
                            </Box>
                            <TableContainer>
                                {/* Table of APIs */}
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead sx={{ bgcolor: 'background.default' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>API Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Method / Path</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Requests</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Error Rate</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Latency (P95)</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Owner</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dashboardData.topApis.map((api, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                                            >
                                                <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                                    {api.name}
                                                    <Typography variant="caption" display="block" color="text.secondary">
                                                        {api.version}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            label={api.method}
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.65rem',
                                                                fontWeight: 700,
                                                                bgcolor: api.method === 'GET' ? 'info.lighter' : api.method === 'POST' ? 'success.lighter' : 'warning.lighter',
                                                                color: api.method === 'GET' ? 'info.main' : api.method === 'POST' ? 'success.main' : 'warning.main',
                                                            }}
                                                        />
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                            {api.path}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={api.status}
                                                        size="small"
                                                        color={getStatusColor(api.status) as any}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                    {formatNumber(api.requests)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                                        <Typography variant="body2" fontWeight={api.errorRatePercent > 1 ? 700 : 400} color={api.errorRatePercent > 1 ? 'error.main' : 'text.primary'}>
                                                            {api.errorRatePercent}%
                                                        </Typography>
                                                        {api.errorRatePercent > 0 && (
                                                            <CircularProgress
                                                                variant="determinate"
                                                                value={Math.min(api.errorRatePercent * 10, 100)}
                                                                color={api.errorRatePercent > 3 ? 'error' : api.errorRatePercent > 1 ? 'warning' : 'success'}
                                                                size={16}
                                                                thickness={6}
                                                            />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                                                    {api.p95LatencyMs}ms
                                                </TableCell>
                                                <TableCell>
                                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.light' }}>
                                                        {api.ownerTeam.charAt(0)}
                                                    </Avatar>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Right Sidebar - Summary & Consumers */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        {/* Summary Card */}
                        <Paper
                            elevation={0}
                            sx={{
                                mb: 3,
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText'
                            }}
                        >
                            {/* Summary Header */}
                            <Typography variant="h6" fontWeight="800" gutterBottom sx={{ color: 'inherit' }}>
                                Summary
                            </Typography>
                            {/* Summary Grid */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 2 }}>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Total Requests
                                    </Typography>
                                    <Typography variant="h5" fontWeight="800">
                                        {formatNumber(dashboardData.summary.totalRequests)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Avg Latency
                                    </Typography>
                                    <Typography variant="h5" fontWeight="800">
                                        {dashboardData.summary.avgLatencyMs}ms
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Error Rate
                                    </Typography>
                                    <Typography variant="h5" fontWeight="800">
                                        {dashboardData.summary.errorRatePercent}%
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Active Consumers
                                    </Typography>
                                    <Typography variant="h5" fontWeight="800">
                                        {dashboardData.summary.activeConsumers}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Top Consumers */}
                        <Paper
                            elevation={0}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                overflow: 'hidden'
                            }}
                        >
                            {/* Top Consumers Header */}
                            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle1" fontWeight="800">
                                    Top Consumers
                                </Typography>
                            </Box>
                            <Box>
                                {/* Top Consumers Grid */}
                                {dashboardData.topConsumers.map((consumer, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            p: 2,
                                            borderBottom: index < dashboardData.topConsumers.length - 1 ? '1px solid' : 'none',
                                            borderColor: 'divider',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="700">
                                                {consumer.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Chip label={consumer.type} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatNumber(consumer.requests)} reqs
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography
                                                variant="caption"
                                                fontWeight="700"
                                                sx={{
                                                    color: consumer.errorRatePercent > 2 ? 'error.main' : 'success.main',
                                                    bgcolor: consumer.errorRatePercent > 2 ? 'error.lighter' : 'success.lighter',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1
                                                }}
                                            >
                                                {consumer.errorRatePercent}% err
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
