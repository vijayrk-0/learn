"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Paper,
    Typography,
    Chip,
    Divider,
    Button,
    Card,
    CardContent,
    Stack,
    Alert,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Speed as SpeedIcon,
    TrendingUp as TrendingUpIcon,
    ErrorOutline as ErrorOutlineIcon,
    People as PeopleIcon,
} from "@mui/icons-material";
import { useGetDashboardDataListQuery } from "@/store/rtk/dashboardRTK";
import { topApiInterface } from "@/app/dashboard/dashboardSchema";

export default function ApiDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    // Decode the slug to extract name, method, and path
    const decodedSlug = decodeURIComponent(slug);
    const parts = decodedSlug.split("-");

    // Since path can contain hyphens, we need to reconstruct it
    const name = parts[0];
    const method = parts[1];
    const path = parts.slice(2).join("-");

    // Fetch all APIs and find the matching one
    const { data, isLoading, isError, error } = useGetDashboardDataListQuery({
        page: 1,
        limit: 1000, 
        name,
        method,
        path,
    });

    const api = data?.data?.[0];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy":
                return "success";
            case "degraded":
                return "warning";
            case "down":
                return "error";
            default:
                return "default";
        }
    };

    // Get status icon based on status
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "healthy":
                return <CheckCircleIcon />;
            case "degraded":
                return <WarningIcon />;
            case "down":
                return <ErrorIcon />;
            default:
                return null;
        }
    };

    // Get method color based on method
    const getMethodColor = (method: string) => {
        switch (method) {
            case "GET":
                return "primary";
            case "POST":
                return "success";
            case "PUT":
                return "warning";
            case "DELETE":
                return "error";
            default:
                return "default";
        }
    };

    // Handle loading state
    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    // Handle error state
    if (isError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Error loading API details: {JSON.stringify(error)}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push("/dashboard/apis")}
                    sx={{ mt: 2 }}
                >
                    Back to API List
                </Button>
            </Box>
        );
    }

    if (!api) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">API not found</Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push("/dashboard/apis")}
                    sx={{ mt: 2 }}
                >
                    Back to API List
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            {/* Header Section */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Tooltip title="Back to API List">
                    <IconButton
                        onClick={() => router.push("/dashboard/apis")}
                        sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": { bgcolor: "primary.dark" }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    {api.name}
                </Typography>
                <Chip
                    label={api.status}
                    color={getStatusColor(api.status) as any}
                    icon={getStatusIcon(api.status) as any}
                    sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                />
            </Stack>

            {/* API Overview Card */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    API Overview
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Using Box with flex for responsive layout */}
                <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    mb: 3
                }}>
                    {/* Method */}
                    <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Method
                        </Typography>
                        <Chip
                            label={api.method}
                            color={getMethodColor(api.method) as any}
                            variant="outlined"
                            sx={{ fontWeight: "bold", fontSize: "0.95rem" }}
                        />
                    </Box>

                    {/* Version */}
                    <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Version
                        </Typography>
                        <Typography variant="h6" fontWeight="medium">
                            {api.version}
                        </Typography>
                    </Box>

                    {/* Owner Team */}
                    <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Owner Team
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <PeopleIcon color="action" />
                            <Typography variant="h6" fontWeight="medium">
                                {api.ownerTeam}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Status */}
                    <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Status
                        </Typography>
                        <Typography variant="h6" fontWeight="medium" color={`${getStatusColor(api.status)}.main`}>
                            {api.status.toUpperCase()}
                        </Typography>
                    </Box>
                </Box>
                {/* Endpoint Path */}
                <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Endpoint Path
                    </Typography>
                    <Paper
                        sx={{
                            p: 2,
                            bgcolor: "grey.100",
                            fontFamily: "monospace",
                            fontSize: "0.95rem",
                            borderRadius: 1,
                        }}
                    >
                        {api.path}
                    </Paper>
                </Box>
            </Paper>

            {/* Metrics Section */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Performance Metrics
            </Typography>

            {/* Using Box with flex for responsive cards */}
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                mb: 3
            }}>
                {/* Requests Card */}
                <Box sx={{ flex: "1 1 300px", minWidth: "280px" }}>
                    <Card
                        elevation={2}
                        sx={{
                            height: "100%",
                            borderLeft: 4,
                            borderColor: "primary.main",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "translateY(-4px)" },
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="text.secondary">
                                    Total Requests
                                </Typography>
                                <TrendingUpIcon color="primary" fontSize="large" />
                            </Stack>
                            <Typography variant="h3" fontWeight="bold" color="primary.main">
                                {api.requests.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Total number of API calls
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Error Rate Card */}
                <Box sx={{ flex: "1 1 300px", minWidth: "280px" }}>
                    <Card
                        elevation={2}
                        sx={{
                            height: "100%",
                            borderLeft: 4,
                            borderColor: api.errorRatePercent > 1 ? "error.main" : "success.main",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "translateY(-4px)" },
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="text.secondary">
                                    Error Rate
                                </Typography>
                                <ErrorOutlineIcon
                                    color={api.errorRatePercent > 1 ? "error" : "success"}
                                    fontSize="large"
                                />
                            </Stack>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color={api.errorRatePercent > 1 ? "error.main" : "success.main"}
                            >
                                {api.errorRatePercent}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Percentage of failed requests
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Latency Card */}
                <Box sx={{ flex: "1 1 300px", minWidth: "280px" }}>
                    <Card
                        elevation={2}
                        sx={{
                            height: "100%",
                            borderLeft: 4,
                            borderColor: "warning.main",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "translateY(-4px)" },
                        }}
                    >
                        {/* P95 Latency Card */}
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="text.secondary">
                                    P95 Latency
                                </Typography>
                                <SpeedIcon color="warning" fontSize="large" />
                            </Stack>
                            <Typography variant="h3" fontWeight="bold" color="warning.main">
                                {api.p95LatencyMs}
                                <Typography component="span" variant="h6" color="text.secondary" ml={1}>
                                    ms
                                </Typography>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                95th percentile response time
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Health Status Alert */}
            <Box sx={{ mt: 3 }}>
                {api.status === "healthy" && (
                    <Alert severity="success" icon={<CheckCircleIcon />}>
                        This API is operating normally with no detected issues.
                    </Alert>
                )}
                {api.status === "degraded" && (
                    <Alert severity="warning" icon={<WarningIcon />}>
                        This API is experiencing some performance degradation. Monitoring recommended.
                    </Alert>
                )}
                {api.status === "down" && (
                    <Alert severity="error" icon={<ErrorIcon />}>
                        This API is currently down. Immediate attention required.
                    </Alert>
                )}
            </Box>
        </Box>
    );
}
