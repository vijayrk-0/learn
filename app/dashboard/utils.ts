// Get status color
export const getStatusColor = (status: string) => {
    switch (status) {
        case 'healthy': return 'success';
        case 'degraded': return 'warning';
        case 'down': return 'error';
        default: return 'default';
    }
};

// Get severity color
export const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'info';
        default: return 'default';
    }
};

// Format number with commas
export const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
};
