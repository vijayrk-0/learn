
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { topApiInterface } from "@/app/dashboard/dashboardSchema";
import { headCells } from "./tableConfig";

interface ActiveFilterChipsProps {
    activeFilters: Record<string, string>;
    onDelete: (key: keyof topApiInterface) => void;
    onClearAll: () => void;
}

export default function ActiveFilterChips({
    activeFilters,
    onDelete,
    onClearAll,
}: ActiveFilterChipsProps) {
    const activeKeys = Object.keys(activeFilters).filter(
        (key) => activeFilters[key] && activeFilters[key].trim() !== ""
    ) as (keyof topApiInterface)[];

    if (activeKeys.length === 0) {
        return null;
    }

    return (
        <Box
            display="flex"
            flexWrap={{ xs: "nowrap", sm: "wrap" }}
            gap={1}
            alignItems="center"
            mb={2}
            sx={{
                overflowX: { xs: "auto", sm: "visible" },
                pb: { xs: 1, sm: 0 },
                scrollbarWidth: "none", // Hide scrollbar for cleaner look
                "&::-webkit-scrollbar": { display: "none" }
            }}
        >
            <Typography variant="body2" color="text.secondary" mr={1} whiteSpace="nowrap">
                Active Filters:
            </Typography>
            {activeKeys.map((key) => {
                const headCell = headCells.find((cell) => cell.id === key);
                const label = headCell ? headCell.label : key;
                const value = activeFilters[key];

                return (
                    <Chip
                        key={key}
                        label={`${label}: ${value}`}
                        onDelete={() => onDelete(key)}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ whiteSpace: "nowrap" }}
                    />
                );
            })}
            {activeKeys.length > 1 && (
                <Chip
                    label="Clear All"
                    onClick={onClearAll}
                    color="default"
                    variant="filled"
                    size="small"
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                />
            )}
        </Box>
    );
}
