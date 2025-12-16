import React, { useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Box,
  Button,
  Autocomplete,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { topApiInterface } from "@/app/dashboard/dashboardSchema";
import Pagination from "./Pagination";
import { useGetDashboardDataListByIdQuery, useGetDashboardDataListQuery } from "@/store/rtk/dashboardRTK";
import ApiFilterSidebar from "./ApiFilterSidebar";
import ActiveFilterChips from "./ActiveFilterChips";

type Order = "asc" | "desc";

import { headCells } from "./tableConfig";

interface ApiTableProps {
  data: topApiInterface[];
  order: Order;
  orderBy: keyof topApiInterface;
  onRequestSort: (property: keyof topApiInterface) => void;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (api: topApiInterface) => void;
  onDelete: (api: topApiInterface) => void;
  filters: Partial<Record<keyof topApiInterface, string>>;
  onFilterChange: (property: keyof topApiInterface, value: string) => void;
  onFilterDelete: (property: keyof topApiInterface) => void;
  handleResetFilters: () => void;
  showFilters: boolean;
  loading?: boolean;
}

export default function ApiTable({
  data,
  order,
  orderBy,
  onRequestSort,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
  onFilterDelete,
  handleResetFilters,
  showFilters,
  loading = false,
}: ApiTableProps) {

  // Get Status Color
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

  // Group values of the API Fields
  const groupByFieldUniqueValues = (
    items: topApiInterface[]
  ): Record<keyof topApiInterface, string[]> => {
    const groupedSets: Record<keyof topApiInterface, Set<string>> = {
      id: new Set(),
      name: new Set(),
      version: new Set(),
      method: new Set(),
      path: new Set(),
      status: new Set(),
      requests: new Set(),
      errorRatePercent: new Set(),
      p95LatencyMs: new Set(),
      ownerTeam: new Set(),
    };

    for (const item of items) {
      (Object.keys(groupedSets) as (keyof topApiInterface)[]).forEach((key) => {
        const rawValue = item[key];
        groupedSets[key].add(String(rawValue));
      });
    }

    const grouped: Record<keyof topApiInterface, string[]> = {
      id: [],
      name: [],
      version: [],
      method: [],
      path: [],
      status: [],
      requests: [],
      errorRatePercent: [],
      p95LatencyMs: [],
      ownerTeam: [],
    };

    (Object.keys(groupedSets) as (keyof topApiInterface)[]).forEach((key) => {
      grouped[key] = Array.from(groupedSets[key]).sort();
    });

    return grouped;
  };

  const allApis = useGetDashboardDataListQuery()

  const groupedData = useMemo(() => groupByFieldUniqueValues(allApis.data?.data || []), [allApis.data?.data]);

  return (
    <React.Fragment>
      <ActiveFilterChips
        activeFilters={filters as Record<string, string>}
        onDelete={onFilterDelete}
        onClearAll={handleResetFilters}
      />
      {/* Desktop Table View */}
      <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
        <Table sx={{ minWidth: 750 }} size="medium">
          <TableHead sx={{ bgcolor: "grey.100", color: "Grey" }}>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ fontWeight: "bold", color: "inherit" }}
                >
                  <Box
                    component="span"
                    sx={{
                      cursor: headCell.sortable ? "pointer" : "default",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    onClick={() => headCell.sortable && onRequestSort(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id && (
                      <Box component="span" sx={{ ml: 0.5 }}>
                        {order === "desc" ? (
                          <ArrowDownwardIcon fontSize="small" />
                        ) : (
                          <ArrowUpwardIcon fontSize="small" />
                        )}
                      </Box>
                    )}
                  </Box>
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from(new Array(rowsPerPage > 0 ? rowsPerPage : 10)).map(
                (_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton variant="rectangular" width={60} height={30} />
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              data.map((row) => {
                const rowKey = `${row.name}-${row.method}-${row.path}`;
                return (
                  <TableRow
                    hover
                    key={rowKey}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      <Link
                        href={`/dashboard/api-list/${row.id}`}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "inline-block",
                          borderBottom: "1px solid transparent",
                          transition: "border-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.borderColor = "#1976d2")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.borderColor = "transparent")
                        }
                      >
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.version}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.method}
                        size="small"
                        color={
                          row.method === "GET"
                            ? "primary"
                            : row.method === "POST"
                              ? "success"
                              : "warning"
                        }
                        variant="outlined"
                        sx={{ fontWeight: "bold", width: 60 }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: "monospace", fontSize: "0.85em" }}
                    >
                      {row.path}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        color={getStatusColor(row.status) as any}
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {row.requests.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        gap={0.5}
                      >
                        <Typography
                          variant="body2"
                          color={
                            row.errorRatePercent > 1 ? "error.main" : "text.primary"
                          }
                        >
                          {row.errorRatePercent}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{row.p95LatencyMs}</TableCell>
                    <TableCell>{row.ownerTeam}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(row)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(row)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}

            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={headCells.length + 1}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No APIs found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 2 }}>
        {loading ? (
          Array.from(new Array(3)).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          ))
        ) : (
          data.map((row) => (
            <Box
              key={`${row.name}-${row.method}-${row.path}`}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box>
                  <Link
                    href={`/dashboard/api-list/${row.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {row.name}
                    </Typography>
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    v{row.version} • {row.ownerTeam}
                  </Typography>
                </Box>
                <Chip
                  label={row.status}
                  size="small"
                  color={getStatusColor(row.status) as any}
                  sx={{ textTransform: "capitalize", height: 24 }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, bgcolor: "grey.50", p: 1, borderRadius: 1 }}>
                <Chip
                  label={row.method}
                  size="small"
                  color={
                    row.method === "GET"
                      ? "primary"
                      : row.method === "POST"
                        ? "success"
                        : "warning"
                  }
                  variant="outlined"
                  sx={{ fontWeight: "bold", width: 50, height: 20, fontSize: "0.7rem" }}
                />
                <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.8rem", wordBreak: "break-all" }}>
                  {row.path}
                </Typography>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Requests</Typography>
                  <Typography variant="body2" fontWeight="bold">{row.requests.toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Error Rate</Typography>
                  <Typography variant="body2" fontWeight="bold" color={row.errorRatePercent > 1 ? "error.main" : "text.primary"}>
                    {row.errorRatePercent}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Latency</Typography>
                  <Typography variant="body2" fontWeight="bold">{row.p95LatencyMs}ms</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                <Button startIcon={<EditIcon />} size="small" onClick={() => onEdit(row)}>
                  Edit
                </Button>
                <Button startIcon={<DeleteIcon />} size="small" color="error" onClick={() => onDelete(row)}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))
        )}
        {!loading && data.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center", bgcolor: "background.paper", borderRadius: 2 }}>
            <Typography color="text.secondary">No APIs found</Typography>
          </Box>
        )}
      </Box>

      {/* Shared Pagination */}
      <Pagination
        selectedRow={rowsPerPage}
        selectedPage={page}
        totalPages={Math.ceil(totalCount / rowsPerPage)}
        onRowsChange={(event, newRow) => {
          const syntheticEvent = {
            ...(event as React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement
            >),
            target: { value: String(newRow) },
          } as React.ChangeEvent<HTMLInputElement>;
          onRowsPerPageChange(syntheticEvent);
        }}
        onPageChange={(event, newPage) => {
          onPageChange(
            event as React.MouseEvent<HTMLButtonElement> | null,
            newPage
          );
        }}
        rowOptions={[5, 10, 25, 50, 100]}
      />
    </React.Fragment>

  );
}
