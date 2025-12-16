import React from 'react';
import {
    Paper,
    Box,
    Typography,
} from '@mui/material';
import { formatNumber } from '@/app/dashboard/utils';
import { summaryInterface } from '@/app/dashboard/dashboardSchema';
interface DashboardSummaryProps {
    summary: summaryInterface;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ summary }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
            }}
        >
            {/* Summary Header */}
            <Typography variant="h6" fontWeight="800" gutterBottom sx={{ color: 'inherit' }}>
                Summary
            </Typography>
            {/* Summary Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 2 }}>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Total Requests
                    </Typography>
                    <Typography variant="h5" fontWeight="800">
                        {formatNumber(summary.totalRequests)}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Avg Latency
                    </Typography>
                    <Typography variant="h5" fontWeight="800">
                        {summary.avgLatencyMs}ms
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Error Rate
                    </Typography>
                    <Typography variant="h5" fontWeight="800">
                        {summary.errorRatePercent}%
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Active Consumers
                    </Typography>
                    <Typography variant="h5" fontWeight="800">
                        {summary.activeConsumers}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default DashboardSummary;
