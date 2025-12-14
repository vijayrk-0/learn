import React from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    Typography,
    Chip,
    Tooltip,
    IconButton,
    Box,
    Button,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Skeleton, } from "@mui/material"; // Import Skeleton
import { topApiInterface } from "@/app/dashboard/dashboardSchema";
import Pagination from "./Pagination";

type Order = "asc" | "desc";

interface HeadCell {
    id: keyof topApiInterface;
    label: string;
    numeric: boolean;
    sortable: boolean;
    filterable: boolean;
}

const headCells: readonly HeadCell[] = [
    { id: "name", label: "Name", numeric: false, sortable: true, filterable: true },
    { id: "version", label: "Version", numeric: false, sortable: true, filterable: true },
    { id: "method", label: "Method", numeric: false, sortable: true, filterable: true },
    { id: "path", label: "Path", numeric: false, sortable: true, filterable: true },
    { id: "status", label: "Status", numeric: false, sortable: true, filterable: true },
    { id: "requests", label: "Requests", numeric: true, sortable: true, filterable: true },
    { id: "errorRatePercent", label: "Error %", numeric: true, sortable: true, filterable: true },
    { id: "p95LatencyMs", label: "Latency (P95)", numeric: true, sortable: true, filterable: true },
    { id: "ownerTeam", label: "Owner Team", numeric: false, sortable: true, filterable: true }
];

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
    filters: Record<string, string>;
    onFilterChange: (property: keyof topApiInterface, value: string) => void;
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
    handleResetFilters,
    showFilters,
    loading = false,
}: ApiTableProps) {

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy": return "success";
            case "degraded": return "warning";
            case "down": return "error";
            default: return "default";
        }
    };

    return (
        <TableContainer>
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
                                            {order === "desc" ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
                                        </Box>
                                    )}
                                </Box>
                            </TableCell>
                        ))}
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                    {/* Filter Row */}
                    {showFilters && (
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell key={`filter-${headCell.id}`} align="left" sx={{ p: 1 }}>
                                    {headCell.filterable && (
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            placeholder={`Filter ${headCell.label}...`}
                                            value={filters[headCell.id] || ""}
                                            onChange={(e) => onFilterChange(headCell.id, e.target.value)}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                                style: { fontSize: "0.875rem" },
                                            }}
                                        />
                                    )}
                                </TableCell>
                            ))}

                            <TableCell align="right" sx={{ p: 1, whiteSpace: "nowrap" }}>
                                <Button
                                    size="small"
                                    variant="text"
                                    onClick={handleResetFilters}
                                >
                                    Reset filters
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}

                </TableHead>
                <TableBody>
                    {loading ? (
                        // Render Skeletons
                        Array.from(new Array(rowsPerPage > 0 ? rowsPerPage : 10)).map((_, index) => (
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
                        ))
                    ) : (
                        // Render Data
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
                                            href={`/dashboard/apis/${row.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                                display: "inline-block",
                                                borderBottom: "1px solid transparent",
                                                transition: "border-color 0.2s"
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                                            onMouseOut={(e) => e.currentTarget.style.borderColor = "transparent"}
                                        >
                                            {row.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{row.version}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.method}
                                            size="small"
                                            color={row.method === "GET" ? "primary" : row.method === "POST" ? "success" : "warning"}
                                            variant="outlined"
                                            sx={{ fontWeight: "bold", width: 60 }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85em" }}>{row.path}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            size="small"
                                            color={getStatusColor(row.status) as any}
                                            sx={{ textTransform: "capitalize" }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{row.requests.toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                                            <Typography variant="body2" color={row.errorRatePercent > 1 ? "error.main" : "text.primary"}>
                                                {row.errorRatePercent}%
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">{row.p95LatencyMs}</TableCell>
                                    <TableCell>{row.ownerTeam}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton size="small" color="primary" onClick={() => onEdit(row)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => onDelete(row)}>
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
                            <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No APIs found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            /> */}
            <Pagination
                selectedRow={rowsPerPage}
                selectedPage={page}
                totalPages={Math.ceil(totalCount / rowsPerPage)}
                // event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null, newRow: number
                onRowsChange={(event, newRow) => {
                    // build a minimal synthetic event for ApiTable’s handler
                    const syntheticEvent = {
                        ...(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>),
                        target: { value: String(newRow) },
                    } as React.ChangeEvent<HTMLInputElement>;

                    onRowsPerPageChange(syntheticEvent);
                }}
                // event: MouseEvent<HTMLButtonElement> | null, newPage: number
                onPageChange={(event, newPage) => {
                    onPageChange(event as React.MouseEvent<HTMLButtonElement> | null, newPage);
                }}
                rowOptions={[5, 10, 25, 50, 100]}
            />



        </TableContainer>
    );
}
