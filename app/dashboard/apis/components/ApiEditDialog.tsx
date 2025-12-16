import React, { useState, useEffect } from "react";
import { apiSchema } from "@/app/dashboard/apis/schema";
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
} from "@mui/material";
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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
                const fieldErrors: { [key: string]: string } = {};
                err.inner.forEach((e: any) => {
                    if (e.path && !fieldErrors[e.path]) {
                        fieldErrors[e.path] = e.message;
                    }
                });
                setErrors(fieldErrors);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? "Edit API" : "Add New API"}</DialogTitle>

            {Object.keys(errors).length > 0 && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setErrors({})}
                >
                    <div
                        style={{
                            maxHeight: 120,
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        {Object.values(errors).map((error) => (
                            <div key={error}>{error}</div>
                        ))}
                    </div>
                </Alert>
            )}



            <DialogContent dividers>
                <Grid container spacing={2} pt={1}>
                    {/* Name */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={currentApi.name}
                            onChange={(e) =>
                                setCurrentApi({ ...currentApi, name: e.target.value })
                            }
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>

                    {/* Method & Version */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.method}>
                            <InputLabel>Method</InputLabel>
                            <Select
                                value={currentApi.method}
                                label="Method"
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

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Version"
                            fullWidth
                            value={currentApi.version}
                            onChange={(e) =>
                                setCurrentApi({ ...currentApi, version: e.target.value })
                            }
                            error={!!errors.version}
                            helperText={errors.version}
                        />
                    </Grid>

                    {/* Path */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Path"
                            fullWidth
                            value={currentApi.path}
                            onChange={(e) =>
                                setCurrentApi({ ...currentApi, path: e.target.value })
                            }
                            error={!!errors.path}
                            helperText={errors.path}
                        />
                    </Grid>

                    {/* Status && Owner Team */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.status}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={currentApi.status}
                                label="Status"
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

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Owner Team"
                            fullWidth
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
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="Requests"
                            type="number"
                            fullWidth
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

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="Error %"
                            type="number"
                            fullWidth
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

                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="Latency (ms)"
                            type="number"
                            fullWidth
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
                <Button onClick={handleSave} variant="contained" disabled={loading}>
                    {initialData ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
