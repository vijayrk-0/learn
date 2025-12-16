import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { apiSchema } from "@/app/dashboard/api-list/schema";
import { topApiInterface } from "@/app/dashboard/dashboardSchema";

interface ApiEditDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (api: topApiInterface) => void;
    initialData?: topApiInterface | null;
    loading: boolean;
}

const defaultApiState: topApiInterface = {
    id: "",
    name: "",
    version: "v1",
    method: "GET",
    path: "",
    status: "healthy",
    requests: 0,
    errorRatePercent: 0,
    p95LatencyMs: 0,
    ownerTeam: "",
};

export default function ApiEditDialog({
    open,
    onClose,
    onSave,
    initialData,
    loading,
}: ApiEditDialogProps) {
    const [currentApi, setCurrentApi] =
        useState<topApiInterface>(defaultApiState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (open) {
            setCurrentApi(initialData ? { ...initialData } : defaultApiState);
            setErrors({});
        }
    }, [open, initialData]);

    const handleSave = () => {
        try {
            setErrors({});
            apiSchema.validateSync(currentApi, { abortEarly: false });
            onSave(currentApi);
        } catch (err: any) {
            if (err.inner) {
                const fieldErrors: Record<string, string> = {};
                err.inner.forEach((e: any) => {
                    if (e.path && !fieldErrors[e.path]) {
                        fieldErrors[e.path] = e.message;
                    }
                });
                setErrors(fieldErrors);
            }
        }
    };

    const labelStyle = {
        mb: 0.5,
        fontSize: 13,
        fontWeight: 500,
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
        >
            <DialogTitle>
                {initialData ? "Edit API" : "Add New API"}
            </DialogTitle>

            {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {Object.values(errors).map((err) => (
                        <div key={err}>{err}</div>
                    ))}
                </Alert>
            )}

            <DialogContent dividers>
                <Grid container spacing={2}>
                    {/* API Name */}
                    <Grid xs={12}>
                        <InputLabel sx={labelStyle}>Name</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            value={currentApi.name}
                            onChange={(e) =>
                                setCurrentApi({ ...currentApi, name: e.target.value })
                            }
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>

                    {/* Request Method */}
                    <Grid xs={12} sm={6}>
                        <InputLabel sx={labelStyle}>Method</InputLabel>
                        <FormControl fullWidth size="small" error={!!errors.method}>
                            <Select
                                value={currentApi.method}
                                onChange={(e) =>
                                    setCurrentApi({
                                        ...currentApi,
                                        method: e.target.value as any,
                                    })
                                }
                            >
                                <MenuItem value="GET">GET</MenuItem>
                                <MenuItem value="POST">POST</MenuItem>
                                <MenuItem value="PUT">PUT</MenuItem>
                                <MenuItem value="DELETE">DELETE</MenuItem>
                                <MenuItem value="PATCH">PATCH</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* API Version */}
                    <Grid xs={12} sm={6}>
                        <InputLabel sx={labelStyle}>Version</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            value={currentApi.version}
                            onChange={(e) =>
                                setCurrentApi({ ...currentApi, version: e.target.value })
                            }
                            error={!!errors.version}
                            helperText={errors.version}
                        />
                    </Grid>

                    {/* Endpoint Path */}
                    <Grid xs={12}>
                        <InputLabel sx={labelStyle}>Path</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            value={currentApi.path}
                            onChange={(e) =>
                                setCurrentApi({ ...currentApi, path: e.target.value })
                            }
                            error={!!errors.path}
                            helperText={errors.path}
                        />
                    </Grid>

                    {/* API Status */}
                    <Grid xs={12} sm={6}>
                        <InputLabel sx={labelStyle}>Status</InputLabel>
                        <FormControl fullWidth size="small" error={!!errors.status}>
                            <Select
                                value={currentApi.status}
                                onChange={(e) =>
                                    setCurrentApi({
                                        ...currentApi,
                                        status: e.target.value as any,
                                    })
                                }
                            >
                                <MenuItem value="healthy">Healthy</MenuItem>
                                <MenuItem value="degraded">Degraded</MenuItem>
                                <MenuItem value="down">Down</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Owner Team */}
                    <Grid xs={12} sm={6}>
                        <InputLabel sx={labelStyle}>Owner Team</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            value={currentApi.ownerTeam}
                            onChange={(e) =>
                                setCurrentApi({
                                    ...currentApi,
                                    ownerTeam: e.target.value,
                                })
                            }
                            error={!!errors.ownerTeam}
                            helperText={errors.ownerTeam}
                        />
                    </Grid>

                    {/* Metrics */}
                    <Grid xs={12} sm={4}>
                        <InputLabel sx={labelStyle}>Requests</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={currentApi.requests}
                            onChange={(e) =>
                                setCurrentApi({
                                    ...currentApi,
                                    requests: Number(e.target.value),
                                })
                            }
                            error={!!errors.requests}
                            helperText={errors.requests}
                        />
                    </Grid>

                    <Grid xs={12} sm={4}>
                        <InputLabel sx={labelStyle}>Error %</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={currentApi.errorRatePercent}
                            onChange={(e) =>
                                setCurrentApi({
                                    ...currentApi,
                                    errorRatePercent: Number(e.target.value),
                                })
                            }
                            error={!!errors.errorRatePercent}
                            helperText={errors.errorRatePercent}
                        />
                    </Grid>

                    <Grid xs={12} sm={4}>
                        <InputLabel sx={labelStyle}>Latency (ms)</InputLabel>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={currentApi.p95LatencyMs}
                            onChange={(e) =>
                                setCurrentApi({
                                    ...currentApi,
                                    p95LatencyMs: Number(e.target.value),
                                })
                            }
                            error={!!errors.p95LatencyMs}
                            helperText={errors.p95LatencyMs}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading}
                >
                    {initialData ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
