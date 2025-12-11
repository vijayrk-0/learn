import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import {topApiInterface } from "@/app/dashboard/dashboardSchema";

interface ApiDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    apiToDelete: topApiInterface | null;
    loading: boolean;
}

export default function ApiDeleteDialog({
    open,
    onClose,
    onConfirm,
    apiToDelete,
    loading,
}: ApiDeleteDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete the API <strong>{apiToDelete?.name}</strong> ({apiToDelete?.method} {apiToDelete?.path})?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
