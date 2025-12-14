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
import { setPageState } from "@/store/slice/pageStateSlice";
import { useDispatch, useSelector } from "react-redux";

type Order = "asc" | "desc";

export default function ApisPage() {
  const dispatch = useDispatch();
  const pageState = useSelector(
    (state: { pageState: any }) => state.pageState.apisListPage
  );

  // All view state comes from Redux (with safe defaults)
  const order: Order = pageState?.order ?? "asc";
  const orderBy: keyof topApiInterface = pageState?.orderBy ?? "name";
  const page: number = pageState?.page ?? 1; // 1-based
  const rowsPerPage: number = pageState?.limit ?? 10;
  const activeFilters: Record<string, string> = pageState?.activeFilters ?? {};
  const showFilters: boolean = pageState?.showFilters ?? false;

  // Local only for filter inputs before "Apply"
  const [filters, setFilters] = useState<Record<string, string>>(activeFilters);

  // Dialog State (can also be in Redux if you want, but not required)
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<topApiInterface | null>(null);
  const [apiToDelete, setApiToDelete] = useState<topApiInterface | null>(null);

  const queryArgs: TopApisQueryArgs = useMemo(
    () => ({
      page,
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

  const { data, isLoading, isFetching, isError, error } =
    useGetDashboardDataListQuery(queryArgs);
  const [addApi, { isLoading: isAdding }] = useAddDashboardDataListMutation();
  const [updateApi, { isLoading: isUpdating }] = useUpdateDashboardDataListMutation();
  const [deleteApi, { isLoading: isDeleting }] = useDeleteDashboardDataListMutation();

  const loading = isLoading || isFetching || isAdding || isUpdating || isDeleting;
  const rows = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  // Sort
  const handleRequestSort = (property: keyof topApiInterface) => {
    const isAsc = orderBy === property && order === "asc";
    const nextOrder: Order = isAsc ? "desc" : "asc";
    dispatch(
      setPageState({
        page: "apisListPage",
        data: { ...pageState, order: nextOrder, orderBy: property },
      })
    );
  };

  // Pagination
  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(
      setPageState({
        page: "apisListPage",
        data: { ...pageState, page: newPage },
      })
    );
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(
      setPageState({
        page: "apisListPage",
        data: { ...pageState, limit: newLimit, page: 1 },
      })
    );
  };

  // Filters
  const handleFilterChange = (property: keyof topApiInterface, value: string) => {
    const nextFilters = { ...(filters ?? {}), [property]: value };
    setFilters(nextFilters);
  };

  const handleApplyFilters = () => {
    dispatch(
      setPageState({
        page: "apisListPage",
        data: { ...pageState, activeFilters: filters, page: 1 },
      })
    );
  };

  const handleResetFilters = () => {
    setFilters({});
    dispatch(
      setPageState({
        page: "apisListPage",
        data: { ...pageState, activeFilters: null, page: 1 },
      })
    );
  };

  // Dialogs
  const handleOpenCreate = () => {
    setEditingApi(null);
    setEditOpen(true);
  };

  const handleOpenEdit = (api: topApiInterface) => {
    setEditingApi(api);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
  };

  const handleSaveApi = async (api: topApiInterface) => {
    try {
      if (editingApi) {
        await updateApi({
          id: api.id,
          patch: {
            name: api.name,
            version: api.version,
            method: api.method,
            path: api.path,
            status: api.status,
            requests: api.requests,
            errorRatePercent: api.errorRatePercent,
            p95LatencyMs: api.p95LatencyMs,
            ownerTeam: api.ownerTeam,
          },
        }).unwrap();
      } else {
        await addApi(api).unwrap();
      }
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to save API", err);
    }
  };

  const handleOpenDelete = (api: topApiInterface) => {
    setApiToDelete(api);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!apiToDelete) return;
    try {
      await deleteApi({ id: apiToDelete.id }).unwrap();
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
        <Typography variant="h5" fontWeight="bold" color="primary">
          API Inventory
        </Typography>

        <Stack direction="row" gap={1}>
          <Button
            variant={showFilters ? "outlined" : "text"}
            size="small"
            startIcon={<FilterListIcon />}
            onClick={() =>
              dispatch(
                setPageState({
                  page: "apisListPage",
                  data: { ...pageState, showFilters: !showFilters },
                })
              )
            }
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
        handleResetFilters={handleResetFilters}
        showFilters={showFilters}
        loading={loading}
      />

      <ApiEditDialog
        open={editOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveApi}
        initialData={editingApi as any}
        loading={isAdding || isUpdating}
      />

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
