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
    const [currentApi, setCurrentApi] = useState<topApiInterface>(defaultApiState);

    useEffect(() => {
        if (open) {
            setCurrentApi(initialData ? { ...initialData } : defaultApiState);
        }
    }, [open, initialData]);

    const handleSave = () => {
        onSave(currentApi);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? "Edit API" : "Add New API"}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} pt={1}>
                    <Grid container spacing={2}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={currentApi.name}
                            onChange={(e) => setCurrentApi({ ...currentApi, name: e.target.value })}
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel>Method</InputLabel>
                            <Select
                                value={currentApi.method}
                                label="Method"
                                onChange={(e) => setCurrentApi({ ...currentApi, method: e.target.value })}
                            >
                                <MenuItem value="GET">GET</MenuItem>
                                <MenuItem value="POST">POST</MenuItem>
                                <MenuItem value="PUT">PUT</MenuItem>
                                <MenuItem value="DELETE">DELETE</MenuItem>
                                <MenuItem value="PATCH">PATCH</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container spacing={2}>
                        <TextField
                            label="Path"
                            fullWidth
                            value={currentApi.path}
                            onChange={(e) => setCurrentApi({ ...currentApi, path: e.target.value })}
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <TextField
                            label="Version"
                            fullWidth
                            value={currentApi.version}
                            onChange={(e) => setCurrentApi({ ...currentApi, version: e.target.value })}
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={currentApi.status}
                                label="Status"
                                onChange={(e) => setCurrentApi({ ...currentApi, status: e.target.value as any })}
                            >
                                <MenuItem value="healthy">Healthy</MenuItem>
                                <MenuItem value="degraded">Degraded</MenuItem>
                                <MenuItem value="down">Down</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container spacing={2}>
                        <TextField
                            label="Requests"
                            type="number"
                            fullWidth
                            value={currentApi.requests}
                            onChange={(e) => setCurrentApi({ ...currentApi, requests: Number(e.target.value) })}
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <TextField
                            label="Error %"
                            type="number"
                            fullWidth
                            value={currentApi.errorRatePercent}
                            onChange={(e) => setCurrentApi({ ...currentApi, errorRatePercent: Number(e.target.value) })}
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <TextField
                            label="Latency (ms)"
                            type="number"
                            fullWidth
                            value={currentApi.p95LatencyMs}
                            onChange={(e) => setCurrentApi({ ...currentApi, p95LatencyMs: Number(e.target.value) })}
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <TextField
                            label="Owner Team"
                            fullWidth
                            value={currentApi.ownerTeam}
                            onChange={(e) => setCurrentApi({ ...currentApi, ownerTeam: e.target.value })}
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
