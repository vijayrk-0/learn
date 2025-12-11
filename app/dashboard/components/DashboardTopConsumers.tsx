import React from 'react';
import {
    Paper,
    Box,
    Typography,
    Chip,
} from '@mui/material';
import { formatNumber } from './utils';

interface DashboardTopConsumersProps {
    topConsumers: any[];
}

const DashboardTopConsumers: React.FC<DashboardTopConsumersProps> = ({ topConsumers }) => {
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
            {/* Top Consumers Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight="800">
                    Top Consumers
                </Typography>
            </Box>
            <Box>
                {/* Top Consumers Grid */}
                {topConsumers.map((consumer: any, index: number) => (
                    <Box
                        key={index}
                        sx={{
                            p: 2,
                            borderBottom: index < topConsumers.length - 1 ? '1px solid' : 'none',
                            borderColor: 'divider',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle2" fontWeight="700">
                                {consumer.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip label={consumer.type} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {formatNumber(consumer.requests)} reqs
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography
                                variant="caption"
                                fontWeight="700"
                                sx={{
                                    color: consumer.errorRatePercent > 2 ? 'error.main' : 'success.main',
                                    bgcolor: consumer.errorRatePercent > 2 ? 'error.lighter' : 'success.lighter',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1
                                }}
                            >
                                {consumer.errorRatePercent}% err
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default DashboardTopConsumers;
