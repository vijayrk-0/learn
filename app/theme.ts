'use client';
import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: 'var(--font-geist-sans)',
    },
});

export default theme;
