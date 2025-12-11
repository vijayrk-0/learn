import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Alert,
    Chip,
} from '@mui/material';
import {
    CheckCircle,
    Warning,
} from '@mui/icons-material';
import { getSeverityColor } from './utils';

interface AlertItem {
    id: string | number;
    severity: string;
    status: string;
    title: string;
    message: string;
    api: string;
}

interface DashboardAlertsProps {
    alerts: AlertItem[];
}

const DashboardAlerts: React.FC<DashboardAlertsProps> = ({ alerts }) => {
    if (!alerts || alerts.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="800" gutterBottom>
                System Alerts
            </Typography>
            {/* Alerts Grid */}
            <Grid container spacing={2}>
                {alerts.map((alert) => (
                    <Grid size={12} key={alert.id}>
                        <Alert
                            severity={getSeverityColor(alert.severity) as any}
                            sx={{ alignItems: 'center' }}
                            icon={alert.status === 'resolved' ? <CheckCircle /> : <Warning />}
                            action={
                                <Chip
                                    label={alert.status.toUpperCase()}
                                    size="small"
                                    color={alert.status === 'resolved' ? 'success' : 'warning'}
                                    variant="outlined"
                                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                />
                            }
                        >
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {alert.title}
                                </Typography>
                                <Typography variant="body2">
                                    {alert.message} • <Box component="span" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{alert.api}</Box>
                                </Typography>
                            </Box>
                        </Alert>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DashboardAlerts;
