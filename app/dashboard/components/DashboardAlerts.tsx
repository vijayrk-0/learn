import React from 'react';
import {
    Box,
    Typography,
    Alert,
    Chip,
    useMediaQuery,
    useTheme,
    Grid,
} from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import { getSeverityColor } from '@/app/dashboard/utils';
import { AlertItemInterface } from '@/app/dashboard/dashboardSchema';

interface DashboardAlertsProps {
    alerts: AlertItemInterface[];
}

const DashboardAlerts: React.FC<DashboardAlertsProps> = ({ alerts }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!alerts || alerts.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Box sx={{
                mb: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 1, sm: 0 }
            }}>
                <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    System Alerts
                </Typography>
                <Chip
                    label={`${alerts.length} Active`}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                />
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }}>
                {alerts.map((alert) => {
                    const isResolved = alert.status === 'resolved';
                    const severity = getSeverityColor(alert.severity) as 'success' | 'info' | 'warning' | 'error';

                    return (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={alert.id}>
                            <Alert
                                severity={severity}
                                variant="outlined"
                                icon={isResolved ? <CheckCircle fontSize="inherit" /> : <Warning fontSize="inherit" />}
                                sx={{
                                    alignItems: 'flex-start',
                                    borderRadius: 3,
                                    height: '100%',
                                    bgcolor: (theme) => isResolved ? theme.palette.success.light + '0A' : theme.palette.warning.light + '0A',
                                    borderColor: (theme) => isResolved ? theme.palette.success.main + '40' : theme.palette.warning.main + '40',
                                    '& .MuiAlert-message': { width: '100%' },
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        boxShadow: theme.shadows[2],
                                        borderColor: (theme) => isResolved ? theme.palette.success.main : theme.palette.warning.main,
                                        transform: 'translateY(-2px)'
                                    },
                                    '& .MuiAlert-icon': {
                                        p: 1
                                    }
                                }}
                            >
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3, fontSize: { xs: '0.875rem', md: '0.9rem' } }}>
                                            {alert.title}
                                        </Typography>
                                        <Chip
                                            label={alert.status}
                                            size="small"
                                            color={isResolved ? 'success' : 'warning'}
                                            variant={isResolved ? 'outlined' : 'filled'}
                                            sx={{
                                                height: 20,
                                                fontSize: '0.65rem',
                                                textTransform: 'uppercase',
                                                fontWeight: 700,
                                                ml: 1,
                                                flexShrink: 0
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.5, flexGrow: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                                        {alert.message}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                                        <Chip
                                            label={alert.api}
                                            size="small"
                                            sx={{
                                                borderRadius: 1,
                                                height: 22,
                                                bgcolor: 'action.hover',
                                                fontFamily: 'monospace',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Alert>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default DashboardAlerts;
