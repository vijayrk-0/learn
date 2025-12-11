"use client";

import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 1.5,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : "#fafafa",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: 600, letterSpacing: 0.2 }}
          >
            API Management Dashboard
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.25 }}
          >
            Monitor, govern, and optimize your APIs from a single place.
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ whiteSpace: "nowrap" }}
        >
          © {new Date().getFullYear()} API Management Dashboard. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
}
