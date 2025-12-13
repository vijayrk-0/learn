import { notFound } from "next/navigation";
import { Box, Paper, Typography, Chip, Divider, Card, CardContent, Stack, Alert } from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Speed as SpeedIcon,
    TrendingUp as TrendingUpIcon,
    ErrorOutline as ErrorOutlineIcon,
    People as PeopleIcon,
} from "@mui/icons-material";
import { topApiInterface } from "@/app/dashboard/dashboardSchema";
import BackButton from "@/app/dashboard/components/BackButton";

// ISR Configuration: Revalidate every 60 seconds
export const revalidate = 60;

// Helper to get base URL that works in all environments
function getBaseUrl() {
    if (typeof window !== 'undefined') {
        // Browser: use relative URL
        return '';
    }
    if (process.env.VERCEL_URL) {
        // Vercel deployment
        return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
        // Custom app URL
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    // Development fallback
    return `http://localhost:${process.env.PORT || 3000}`;
}

// Generate static params for pre-rendering at build time
export async function generateStaticParams() {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/dashboard/api-lists?page=1&limit=50`, {
            headers: {
                'Content-Type': 'application/json',
                'is-ISR': 'true',
            },
            next: { revalidate: 60 }, // Cache this API call for 60 seconds
            cache: 'no-store', // Prevent build-time caching issues
        });

        if (!response.ok) {
            console.warn("Failed to fetch APIs for static generation");
            return [];
        }

        const data = await response.json();
        const apis = data.data || [];

        return apis.map((api: topApiInterface) => ({
            slug: `${`${api.name}-${api.method}-${api.path}`.replace(/\//g, '_')}`,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

// Fetch API data with ISR caching
async function getApiData(slug: string): Promise<topApiInterface | null> {
    try {
        console.log("slug:", slug);
        const baseUrl = getBaseUrl();
        // ISR: Cache the fetch for 60 seconds, then revalidate in background
        const response = await fetch(`${baseUrl}/api/dashboard/api-lists/${slug}`, {
            headers: {
                'Content-Type': 'application/json',
                'is-ISR': 'true',
            },
            next: { revalidate: 60 }, // Cache this API call for 60 seconds
        });
        if (!response.ok) {
            console.error(`API request failed with status: ${response.status}`);
            return null;
        }

        const result = await response.json();
        console.log("result:", result.data);
        return result.data || null;
    } catch (error) {
        console.error("Error fetching API data:", error);
        return null;
    }
}

// Helper functions
function getStatusColor(status: string): "success" | "warning" | "error" | "default" {
    switch (status?.toLowerCase()) {
        case "healthy":
            return "success";
        case "degraded":
            return "warning";
        case "down":
            return "error";
        default:
            return "default";
    }
}

// Get status icon
function getStatusIcon(status: string) {
    switch (status?.toLowerCase()) {
        case "healthy":
            return <CheckCircleIcon />;
        case "degraded":
            return <WarningIcon />;
        case "down":
            return <ErrorIcon />;
        default:
            return <CheckCircleIcon />;
    }
}


// Get method color
function getMethodColor(method: string): "primary" | "success" | "warning" | "error" | "default" {
    switch (method?.toUpperCase()) {
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
}

// Server Component with ISR
export default async function ApiDetailPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    // Await params
    const { slug } = await params;
    const api = await getApiData(slug);

    console.log("api:", api);

    if (!api) {
        notFound();
    }

    // Get requests, error rate, latency
    const requests = api.requests ?? 0;
    const errorRate = api.errorRatePercent ?? 0;
    const latency = api.p95LatencyMs ?? 0;

    return (
        <Box sx={{ width: "100%", p: 3 }}>
            {/* Header Section */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <BackButton />
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

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
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
                            {api.version || "N/A"}
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
                                {api.ownerTeam || "Unassigned"}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Status */}
                    <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Status
                        </Typography>
                        <Typography variant="h6" fontWeight="medium" color={`${getStatusColor(api.status)}.main`}>
                            {api.status?.toUpperCase() || "UNKNOWN"}
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
                            wordBreak: "break-all",
                        }}
                    >
                        {api.path || "N/A"}
                    </Paper>
                </Box>
            </Paper>

            {/* Metrics Section */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Performance Metrics
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
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
                                {requests.toLocaleString()}
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
                            borderColor: errorRate > 1 ? "error.main" : "success.main",
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
                                    color={errorRate > 1 ? "error" : "success"}
                                    fontSize="large"
                                />
                            </Stack>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color={errorRate > 1 ? "error.main" : "success.main"}
                            >
                                {errorRate}%
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
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" color="text.secondary">
                                    P95 Latency
                                </Typography>
                                <SpeedIcon color="warning" fontSize="large" />
                            </Stack>
                            <Typography variant="h3" fontWeight="bold" color="warning.main">
                                {latency}
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
                {api.status?.toLowerCase() === "healthy" && (
                    <Alert severity="success" icon={<CheckCircleIcon />}>
                        This API is operating normally with no detected issues.
                    </Alert>
                )}
                {api.status?.toLowerCase() === "degraded" && (
                    <Alert severity="warning" icon={<WarningIcon />}>
                        This API is experiencing some performance degradation. Monitoring recommended.
                    </Alert>
                )}
                {api.status?.toLowerCase() === "down" && (
                    <Alert severity="error" icon={<ErrorIcon />}>
                        This API is currently down. Immediate attention required.
                    </Alert>
                )}
            </Box>
        </Box>
    );
}
