"use client";

import React, { useMemo, useState } from "react";
import { Box, Button, Stack, Alert, Typography } from "@mui/material";
import { FilterList as FilterListIcon, Check as CheckIcon } from "@mui/icons-material";
import ApiTable from "./components/ApiTable";
import ApiEditDialog from "./components/ApiEditDialog";
import ApiDeleteDialog from "./components/ApiDeleteDialog";
import {
    useGetDashboardDataListQuery,
    useAddDashboardDataListMutation,
    useUpdateDashboardDataListMutation,
    useDeleteDashboardDataListMutation,
    TopApisQueryArgs,
} from "@/store/rtk/dashboardRTK";
import { topApiInterface } from "@/app/dashboard/dashboardSchema";

type Order = "asc" | "desc";

export default function ApisPage() {
    // Sorting State
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof topApiInterface>("name");

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filters State
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [showFilters, setShowFilters] = useState(false);

    // Dialog State
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingApi, setEditingApi] = useState<topApiInterface | null>(null);
    const [apiToDelete, setApiToDelete] = useState<topApiInterface | null>(null);

    // Build query args for backend based on activeFilters
    const queryArgs: TopApisQueryArgs = useMemo(
        () => ({
            page: page + 1,
            limit: rowsPerPage,
            name: activeFilters.name,
            version: activeFilters.version,
            method: activeFilters.method,
            path: activeFilters.path,
            status: activeFilters.status,
            requests: activeFilters.requests,
            errorRatePercent: activeFilters.errorRatePercent,
            p95LatencyMs: activeFilters.p95LatencyMs,
            ownerTeam: activeFilters.ownerTeam,
        }),
        [page, rowsPerPage, activeFilters]
    );

    // API State
    const { data, isLoading, isFetching, isError, error } = useGetDashboardDataListQuery(queryArgs);
    const [addApi, { isLoading: isAdding }] = useAddDashboardDataListMutation();
    const [updateApi, { isLoading: isUpdating }] = useUpdateDashboardDataListMutation();
    const [deleteApi, { isLoading: isDeleting }] = useDeleteDashboardDataListMutation();

    const loading = isLoading || isFetching || isAdding || isUpdating || isDeleting;

    const rows = data?.data ?? [];
    const totalCount = data?.total ?? 0;

    // Handlers
    const handleRequestSort = (property: keyof topApiInterface) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // Pagination Handlers
    const handlePageChange = (_: unknown, newPage: number) => {
        setPage(newPage);
    };
    // Rows per page handler
    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Filter Handlers
    const handleFilterChange = (property: keyof topApiInterface, value: string) => {
        setFilters((prev) => ({ ...prev, [property]: value }));
    };

    // Apply filters to trigger query
    const handleApplyFilters = () => {
        setActiveFilters(filters);
        setPage(0);
    };

    // Dialog Handlers
    const handleOpenCreate = () => {
        setEditingApi(null);
        setEditOpen(true);
    };

    // Open Edit Dialog
    const handleOpenEdit = (api: topApiInterface) => {
        setEditingApi(api);
        setEditOpen(true);
    };

    // Close Edit Dialog
    const handleCloseEdit = () => {
        setEditOpen(false);
    };

    // Save API
    const handleSaveApi = async (api: topApiInterface) => {
        try {
            if (editingApi) {
                await updateApi({
                    key: {
                        name: editingApi.name,
                        version: editingApi.version,
                        method: editingApi.method,
                        path: editingApi.path,
                        status: editingApi.status,
                        requests: editingApi.requests,
                        errorRatePercent: editingApi.errorRatePercent,
                        p95LatencyMs: editingApi.p95LatencyMs,
                        ownerTeam: editingApi.ownerTeam,
                    },
                    patch: api,
                }).unwrap();
            } else {
                await addApi(api).unwrap();
            }
            setEditOpen(false);
        } catch (err) {
            console.error("Failed to save API", err);
        }
    };

    // Open Delete Dialog
    const handleOpenDelete = (api: topApiInterface) => {
        setApiToDelete(api);
        setDeleteOpen(true);
    };

    // Close Delete Dialog
    const handleCloseDelete = () => {
        setDeleteOpen(false);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        if (!apiToDelete) return;
        try {
            await deleteApi({
                name: apiToDelete.name,
                method: apiToDelete.method,
                path: apiToDelete.path,
            }).unwrap();
            setDeleteOpen(false);
        } catch (err) {
            console.error("Failed to delete API", err);
        }
    };

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            {/* Header / Actions */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                {/* Header */}
                <Typography variant="h5" fontWeight="bold" color="primary">
                    API Inventory
                </Typography>
                {/* Actions */}
                <Stack direction="row" gap={1}>
                    <Button
                        variant={showFilters ? "outlined" : "text"}
                        size="small"
                        startIcon={<FilterListIcon />}
                        onClick={() => setShowFilters((prev) => !prev)}
                    >
                        {showFilters ? "Hide Filters" : "Filters"}
                    </Button>

                    {showFilters && (
                        <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            startIcon={<CheckIcon />}
                            onClick={handleApplyFilters}
                        >
                            Apply
                        </Button>
                    )}

                    <Button variant="contained" onClick={handleOpenCreate}>
                        Add API
                    </Button>
                </Stack>
            </Stack>

            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Error loading data: {JSON.stringify(error)}
                </Alert>
            )}

            <ApiTable
                data={rows}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                filters={filters}
                onFilterChange={handleFilterChange}
                showFilters={showFilters}
                loading={loading}
            />

            {/* Dialogs for edit and Create */}
            <ApiEditDialog
                open={editOpen}
                onClose={handleCloseEdit}
                onSave={handleSaveApi}
                initialData={editingApi as any}
                loading={isAdding || isUpdating}
            />

            {/* Dialogs for delete */}
            <ApiDeleteDialog
                open={deleteOpen}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                apiToDelete={apiToDelete as any}
                loading={isDeleting}
            />
        </Box>
    );
}
