import React, { memo } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  Autocomplete,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface Props {
  selectedRow: number;
  selectedPage: number;
  totalPages: number;
  onRowsChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null, newRow: number) => void;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  rowOptions?: number[];
}

function PaginationComponent({
  selectedRow,
  selectedPage,
  totalPages,
  onRowsChange,
  onPageChange,
  rowOptions = [5, 10, 25, 50, 100],
}: Props) {

  //  Handle Previous page
  const handlePrev = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedPage > 0) {
      onPageChange(event, selectedPage - 1);
    }
  };


  //  Handle Next page
  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedPage < totalPages - 1) {
      onPageChange(event, selectedPage + 1);
    }
  };


  //  Handle Row Input change
  const handleRowsInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: string,
  ) => {
    const num = Number(value);
    if (!Number.isNaN(num) && num > 0) {
      onRowsChange(event, num);
    }
  };

  //  Handle row Input change
  const handleRowsChange = (
    _event: React.SyntheticEvent,
    value: number | string | null,
  ) => {
    if (value === null || value === "") return;
    const num = Number(value);
    if (!Number.isNaN(num) && num > 0) {
      onRowsChange(null, num as number);
    }
  };


  const isPrevDisabled = selectedPage === 0 || totalPages === 0;
  const isNextDisabled = selectedPage === totalPages - 1 || totalPages === 0;

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
      component="section"
      aria-label="Table pagination"
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Input box for the no of row per page */}
        <Autocomplete
          size="small"
          freeSolo
          options={rowOptions}
          value={selectedRow}
          onChange={handleRowsChange}
          getOptionLabel={(option) =>
            typeof option === "number" ? option.toString() : option
          }
          renderInput={(params) => (
            <TextField
              {...params}

              onChange={(event) => handleRowsInputChange(event, event.target.value)}
              inputProps={{
                ...params.inputProps,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
          )}
          sx={{
            minWidth: 150,
          }}
        />

        {/* Display the current page and total pages */}
        <Typography variant="body2" color="text.secondary">
          Page {totalPages === 0 ? 0 : selectedPage + 1} of {totalPages}
        </Typography>
      </Stack>

      {/* Handle Previous and Next */}
      <Box
        component="nav"
        aria-label="Pagination navigation"
        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
      >

        <IconButton
          size="small"
          onClick={handlePrev}
          disabled={isPrevDisabled}
          aria-label="Go to previous page"
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleNext}
          disabled={isNextDisabled}
          aria-label="Go to next page"
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

const Pagination = memo(PaginationComponent);

export default Pagination;
