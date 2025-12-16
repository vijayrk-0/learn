import { notFound } from "next/navigation";
import { Box, Paper, Typography, Chip, Card, CardContent, Stack, Alert, Grid, Avatar } from "@mui/material";
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
            next: { revalidate: 60 },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.warn("Failed to fetch APIs for static generation");
            return [];
        }

        const data = await response.json();
        const apis = data.data || [];

        return apis.map((api: topApiInterface) => ({
            slug: `${`${api.id}`.replace(/\//g, '_')}`,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

// Fetch API data with ISR caching
async function getApiData(slug: string): Promise<topApiInterface | null> {
    try {
        console.log("Fetching API data for slug:", slug);
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/dashboard/api-lists/${slug}`, {
            headers: {
                'Content-Type': 'application/json',
                'is-ISR': 'true',
            },
            next: { revalidate: 60 },
        });
        if (!response.ok) {
            console.error(`API request failed with status: ${response.status}`);
            return null;
        }

        const result = await response.json();
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

    if (!api) {
        notFound();
    }

    // Get requests, error rate, latency
    const requests = api.requests ?? 0;
    const errorRate = api.errorRatePercent ?? 0;
    const latency = api.p95LatencyMs ?? 0;

    return (
        <Box sx={{ width: "100%", p: { xs: 2, sm: 4 } }}>
            {/* Header Section */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                mb={4}
            >
                <BackButton />
                <Typography
                    variant="h3"
                    fontWeight="800"
                    color="text.primary"
                    sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem" }, letterSpacing: "-0.02em" }}
                >
                    {api.name}
                </Typography>
                <Chip
                    label={api.status}
                    color={getStatusColor(api.status) as any}
                    size="small"
                    sx={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        px: 1,
                        height: 32,
                        borderRadius: "16px",
                    }}
                />
            </Stack>

            {/* API Overview Card */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 4 },
                    mb: 4,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ textTransform: "uppercase", letterSpacing: "1px", color: "text.secondary", fontSize: "0.75rem", mb: 2 }}
                >
                    API Configuration
                </Typography>

                <Grid container spacing={4}>
                    {/* Method */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Method
                        </Typography>
                        <Chip
                            label={api.method}
                            color={getMethodColor(api.method) as any}
                            sx={{ fontWeight: "800", borderRadius: 1.5, px: 1 }}
                        />
                    </Grid>

                    {/* Version */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Version
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                            {api.version || "N/A"}
                        </Typography>
                    </Grid>

                    {/* Owner Team */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Owner Team
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}>
                                <PeopleIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                            </Avatar>
                            <Typography variant="body1" fontWeight="500">
                                {api.ownerTeam || "Unassigned"}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Status Text */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Current Status
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color={`${getStatusColor(api.status)}.main`}>
                            {api.status?.toUpperCase() || "UNKNOWN"}
                        </Typography>
                    </Grid>

                    {/* Endpoint Path */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Endpoint Path
                        </Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: "grey.50",
                                fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
                                fontSize: "0.9rem",
                                borderRadius: 2,
                                border: "1px dashed",
                                borderColor: "divider",
                                wordBreak: "break-all",
                                color: "text.primary"
                            }}
                        >
                            {api.path || "N/A"}
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>

            {/* Metrics Section */}
            <Typography variant="h5" fontWeight="800" sx={{ mb: 3, letterSpacing: "-0.01em" }}>
                Performance Metrics
            </Typography>

            <Grid container spacing={3} mb={4}>
                {/* Requests Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                            transition: "all 0.2s",
                            "&:hover": {
                                borderColor: "primary.main",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                            },
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                <Avatar sx={{ bgcolor: "primary.50", color: "primary.main", width: 48, height: 48 }}>
                                    <TrendingUpIcon />
                                </Avatar>
                                <Chip label="Last 24h" size="small" sx={{ bgcolor: "grey.100", fontWeight: 600, fontSize: "0.75rem" }} />
                            </Box>
                            <Typography variant="h3" fontWeight="800" color="text.primary" sx={{ fontSize: { xs: "2rem", sm: "2.5rem" }, mb: 0.5 }}>
                                {requests.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                                Total API Requests
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Error Rate Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                            transition: "all 0.2s",
                            "&:hover": {
                                borderColor: errorRate > 1 ? "error.main" : "success.main",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                            },
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                <Avatar sx={{
                                    bgcolor: errorRate > 1 ? "error.50" : "success.50",
                                    color: errorRate > 1 ? "error.main" : "success.main",
                                    width: 48,
                                    height: 48
                                }}>
                                    <ErrorOutlineIcon />
                                </Avatar>
                                <Chip label={errorRate > 1 ? "Action Needed" : "Optimal"} size="small"
                                    sx={{
                                        bgcolor: errorRate > 1 ? "error.50" : "success.50",
                                        color: errorRate > 1 ? "error.dark" : "success.dark",
                                        fontWeight: 700,
                                        fontSize: "0.75rem"
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="h3"
                                fontWeight="800"
                                color={errorRate > 1 ? "error.main" : "text.primary"}
                                sx={{ fontSize: { xs: "2rem", sm: "2.5rem" }, mb: 0.5 }}
                            >
                                {errorRate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                                Error Rate
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Latency Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                            transition: "all 0.2s",
                            "&:hover": {
                                borderColor: "warning.main",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                            },
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                <Avatar sx={{ bgcolor: "warning.50", color: "warning.main", width: 48, height: 48 }}>
                                    <SpeedIcon />
                                </Avatar>
                                <Chip label="Target: <200ms" size="small" sx={{ bgcolor: "grey.100", fontWeight: 600, fontSize: "0.75rem" }} />
                            </Box>
                            <Typography variant="h3" fontWeight="800" color="text.primary" sx={{ fontSize: { xs: "2rem", sm: "2.5rem" }, mb: 0.5 }}>
                                {latency}
                                <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1, fontWeight: 600 }}>
                                    ms
                                </Typography>
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                                P95 Latency
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
