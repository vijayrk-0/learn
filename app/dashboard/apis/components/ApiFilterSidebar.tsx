import React from "react";
import {
    Box,
    Drawer,
    Typography,
    Stack,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { topApiInterface } from "@/app/dashboard/dashboardSchema";

interface ApiFilterSidebarProps {
    open: boolean;
    onClose: () => void;
    filters: Record<string, string>;
    onFilterChange: (property: keyof topApiInterface, value: string) => void;
    onApply: () => void;
    onReset: () => void;
}

const NUMERIC_OPS = ["=", ">", ">=", "<", "<="] as const;

function getOp(value: string | undefined): string {
    return value?.match(/^(>=|<=|>|<|=)/)?.[1] ?? "=";
}

function getVal(value: string | undefined): string {
    return (value || "").replace(/^(>=|<=|>|<|=)/, "");
}

export default function ApiFilterSidebar({
    open,
    onClose,
    filters,
    onFilterChange,
    onApply,
    onReset,
}: ApiFilterSidebarProps) {
    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box
                sx={{
                    width: { xs: "100%", sm: 380 },
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    bgcolor: "background.paper",
                }}
            >
                {/* Header */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Filter APIs
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Divider sx={{ mb: 3 }} />

                {/* Form Fields Container */}
                <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
                    <Stack spacing={2.5}>
                        {/* General Information */}
                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                gutterBottom
                                sx={{
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    fontSize: "0.75rem",
                                    letterSpacing: "0.05em",
                                    mb: 1
                                }}
                            >
                                General Information
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    placeholder="API Name"
                                    value={filters.name || ""}
                                    onChange={(e) => onFilterChange("name", e.target.value)}
                                    InputProps={{
                                        sx: { fontSize: "0.875rem" }
                                    }}
                                />
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        placeholder="Version"
                                        value={filters.version || ""}
                                        onChange={(e) => onFilterChange("version", e.target.value)}
                                        InputProps={{
                                            sx: { fontSize: "0.875rem" }
                                        }}
                                    />
                                    <TextField
                                        select
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={filters.method || ""}
                                        onChange={(e) => onFilterChange("method", e.target.value)}
                                        SelectProps={{
                                            displayEmpty: true,
                                        }}
                                        InputProps={{
                                            sx: { fontSize: "0.875rem" }
                                        }}
                                    >
                                        <MenuItem value="">
                                            <Typography color="text.secondary">All Methods</Typography>
                                        </MenuItem>
                                        {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                                            <MenuItem key={method} value={method}>
                                                {method}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>

                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    placeholder="/api/path"
                                    value={filters.path || ""}
                                    onChange={(e) => onFilterChange("path", e.target.value)}
                                    InputProps={{
                                        sx: { fontSize: "0.875rem" }
                                    }}
                                />

                                <TextField
                                    select
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={filters.status || ""}
                                    onChange={(e) => onFilterChange("status", e.target.value)}
                                    SelectProps={{
                                        displayEmpty: true,
                                    }}
                                    InputProps={{
                                        sx: { fontSize: "0.875rem" }
                                    }}
                                >
                                    <MenuItem value="">
                                        <Typography color="text.secondary">All Statuses</Typography>
                                    </MenuItem>
                                    {["healthy", "degraded", "down"].map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    placeholder="Owner Team"
                                    value={filters.ownerTeam || ""}
                                    onChange={(e) => onFilterChange("ownerTeam", e.target.value)}
                                    InputProps={{
                                        sx: { fontSize: "0.875rem" }
                                    }}
                                />
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Metrics */}
                        <Box>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                gutterBottom
                                sx={{
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    fontSize: "0.75rem",
                                    letterSpacing: "0.05em",
                                    mb: 1
                                }}
                            >
                                Metrics
                            </Typography>
                            <Stack spacing={2}>
                                {/* Requests */}
                                <Typography variant="caption" color="text.secondary" sx={{ mb: -1.5, ml: 0.5 }}>Requests count</Typography>
                                <Stack direction="row" spacing={0}>
                                    <TextField
                                        select
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            width: 80,
                                            "& .MuiOutlinedInput-root": {
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                                fieldset: { borderRight: "none" }
                                            }
                                        }}
                                        value={getOp(filters.requests)}
                                        onChange={(e) => {
                                            const op = e.target.value || "=";
                                            const value = getVal(filters.requests);
                                            const next = value ? `${op}${value}` : "";
                                            onFilterChange("requests", next);
                                        }}
                                    >
                                        {NUMERIC_OPS.map((op) => (
                                            <MenuItem key={op} value={op}>
                                                {op}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        type="number"
                                        placeholder="count"
                                        value={getVal(filters.requests)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const op = getOp(filters.requests);
                                            const next = value ? `${op}${value}` : "";
                                            onFilterChange("requests", next);
                                        }}
                                        InputProps={{
                                            sx: {
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0
                                            }
                                        }}
                                    />
                                </Stack>

                                {/* Error % */}
                                <Typography variant="caption" color="text.secondary" sx={{ mb: -1.5, ml: 0.5 }}>Error Rate %</Typography>
                                <Stack direction="row" spacing={0}>
                                    <TextField
                                        select
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            width: 80,
                                            "& .MuiOutlinedInput-root": {
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                                fieldset: { borderRight: "none" }
                                            }
                                        }}
                                        value={getOp(filters.errorRatePercent)}
                                        onChange={(e) => {
                                            const op = e.target.value || "=";
                                            const value = getVal(filters.errorRatePercent);
                                            const next = value ? `${op}${value}` : "";
                                            onFilterChange("errorRatePercent", next);
                                        }}
                                    >
                                        {NUMERIC_OPS.map((op) => (
                                            <MenuItem key={op} value={op}>
                                                {op}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        type="number"
                                        placeholder="percentage"
                                        value={getVal(filters.errorRatePercent)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const op = getOp(filters.errorRatePercent);
                                            const next = value ? `${op}${value}` : "";
                                            onFilterChange("errorRatePercent", next);
                                        }}
                                        InputProps={{
                                            sx: {
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0
                                            }
                                        }}
                                    />
                                </Stack>

                                {/* Latency */}
                                <Typography variant="caption" color="text.secondary" sx={{ mb: -1.5, ml: 0.5 }}>Latency (P95 ms)</Typography>
                                <Stack direction="row" spacing={0}>
                                    <TextField
                                        select
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            width: 80,
                                            "& .MuiOutlinedInput-root": {
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                                fieldset: { borderRight: "none" }
                                            }
                                        }}
                                        value={getOp(filters.p95LatencyMs)}
                                        onChange={(e) => {
                                            const op = e.target.value || "=";
                                            const value = getVal(filters.p95LatencyMs);
                                            const next = value ? `${op}${value}` : "";
                                            onFilterChange("p95LatencyMs", next);
                                        }}
                                    >
                                        {NUMERIC_OPS.map((op) => (
                                            <MenuItem key={op} value={op}>
                                                {op}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        type="number"
                                        placeholder="ms"
                                        value={getVal(filters.p95LatencyMs)}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const op = getOp(filters.p95LatencyMs);
                                            const next = value ? `${op}${value}` : "";
                                            onFilterChange("p95LatencyMs", next);
                                        }}
                                        InputProps={{
                                            sx: {
                                                borderTopLeftRadius: 0,
                                                borderBottomLeftRadius: 0
                                            }
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Footer Actions */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        onClick={onReset}
                        fullWidth
                        color="inherit"
                    >
                        Clear All
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onApply}
                        fullWidth
                        disableElevation
                    >
                        Apply Filters
                    </Button>
                </Stack>
            </Box>
        </Drawer>
    );
}
