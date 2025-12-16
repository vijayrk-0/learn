import React from 'react';
import {
    Paper,
    Box,
    Typography,
    Link,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    CircularProgress,
    Avatar,
} from '@mui/material';
import { getStatusColor, formatNumber } from '@/app/dashboard/utils';
import { topApiInterface } from '@/app/dashboard/dashboardSchema';
interface DashboardTopApisProps {
    topApis: topApiInterface[];
}

const DashboardTopApis: React.FC<DashboardTopApisProps> = ({ topApis }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden'
            }}
        >
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={800} color="text.primary">
                    Top APIs
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Performance metrics by endpoint
                </Typography>
                <Link
                    href="/dashboard/api-list"
                    underline="hover"
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                >
                    View all APIs
                </Link>
            </Box>
            <TableContainer sx={{ overflowX: 'auto' }}>
                {/* Table of APIs */}
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>API Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Method / Path</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Requests</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Error Rate</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Latency (P95)</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Owner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topApis.map((api: any, index: number) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                            >
                                <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                                    {api.name}
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        {api.version}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={api.method}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                bgcolor: api.method === 'GET' ? 'info.lighter' : api.method === 'POST' ? 'success.lighter' : 'warning.lighter',
                                                color: api.method === 'GET' ? 'info.main' : api.method === 'POST' ? 'success.main' : 'warning.main',
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            {api.path}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={api.status}
                                        size="small"
                                        color={getStatusColor(api.status) as any}
                                        variant="outlined"
                                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 500 }}>
                                    {formatNumber(api.requests)}
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                        <Typography variant="body2" fontWeight={api.errorRatePercent > 1 ? 700 : 400} color={api.errorRatePercent > 1 ? 'error.main' : 'text.primary'}>
                                            {api.errorRatePercent}%
                                        </Typography>
                                        {api.errorRatePercent > 0 && (
                                            <CircularProgress
                                                variant="determinate"
                                                value={Math.min(api.errorRatePercent * 10, 100)}
                                                color={api.errorRatePercent > 3 ? 'error' : api.errorRatePercent > 1 ? 'warning' : 'success'}
                                                size={16}
                                                thickness={6}
                                            />
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ fontFamily: 'monospace' }}>
                                    {api.p95LatencyMs}ms
                                </TableCell>
                                <TableCell>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.light' }}>
                                        {api.ownerTeam.charAt(0)}
                                    </Avatar>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default DashboardTopApis;
