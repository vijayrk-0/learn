'use client';

import {
    Box,
    Button,
    Container,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';

// Importing logout action and useDispatch
import { useGetDashboardDataQuery } from '@/store/rtk/dashboardRTK';

import DashboardAlerts from './components/DashboardAlerts';
import DashboardTopApis from './components/DashboardTopApis';
import DashboardSummary from './components/DashboardSummary';
import DashboardTopConsumers from './components/DashboardTopConsumers';
import { useEffect } from 'react';

export default function Dashboard() {
    // Use RTK Query hook to fetch dashboard data
    const {
        data: dashboardData,
        isLoading: loading,
        error: queryError,
        refetch
    } = useGetDashboardDataQuery(undefined, {
        pollingInterval: 100000,
    });

    // Map RTK Query error to string if needed
    const error = queryError ? 'Failed to load dashboard data' : null;

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
                        <Button color="inherit" size="small" onClick={refetch}>
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
        <Box sx={{ bgcolor: '#f8f9fa', width: '100%', overflowX: 'hidden', minHeight: '100%', pb: { xs: 4, sm: 8 } }}>
            {/* Main Content */}
            <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
                <Grid container spacing={3}>
                    {/* Left Column - Alerts & Top APIs */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        {/* Alerts Section */}
                        {dashboardData.alerts.length > 0 && (
                            <DashboardAlerts alerts={dashboardData.alerts} />
                        )}

                        {/* Top APIs Table */}
                        <DashboardTopApis topApis={dashboardData.topApis} />
                    </Grid>

                    {/* Right Sidebar - Summary & Consumers */}
                    <Grid size={{ xs: 12, lg: 4 }}>
                        {/* Summary Card */}
                        <DashboardSummary summary={dashboardData.summary} />

                        {/* Top Consumers */}
                        <DashboardTopConsumers topConsumers={dashboardData.topConsumers} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
