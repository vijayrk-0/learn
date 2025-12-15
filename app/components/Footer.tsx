"use client";

import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        px: { xs: 1.5, sm: 2.5, md: 4 },      
        py: { xs: 0.5, sm: 1.25 },            
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#fafafa",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 0.5, sm: 1.5 },          
          width: "100%",
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              fontWeight: 600,
              letterSpacing: 0.2,
              fontSize: { xs: "0.7rem", sm: "0.875rem" }, 
            }}
          >
            API Management Dashboard
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.15,
              fontSize: { xs: "0.6rem", sm: "0.75rem" }, 
            }}
          >
            Monitor, govern, and optimize your APIs from a single place.
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            whiteSpace: { xs: "normal", sm: "nowrap" },
            textAlign: { xs: "left", sm: "right" },
            fontSize: { xs: "0.6rem", sm: "0.75rem" },   
          }}
        >
          © {new Date().getFullYear()} API Management Dashboard. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
}
