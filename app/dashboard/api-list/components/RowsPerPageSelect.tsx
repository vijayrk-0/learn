import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

type RowsPerPageOption = number;

interface RowsPerPageSelectProps {
  rowOptions: RowsPerPageOption[];
  selectedRow: RowsPerPageOption | null;
  disableClearable?: boolean | undefined;
  onRowsChange: (
    event: React.SyntheticEvent | React.FocusEvent<HTMLInputElement>,
    value: RowsPerPageOption
  ) => void;
}

export function RowsPerPageSelect({
  rowOptions,
  selectedRow,
  onRowsChange,
}: RowsPerPageSelectProps) {
  const defaultOption = rowOptions[0] || 1;

  const [inputValue, setInputValue] = useState(
    selectedRow ? selectedRow.toString() : defaultOption.toString()
  );

  useEffect(() => {
    setInputValue(selectedRow ? selectedRow.toString() : defaultOption.toString());
  }, [selectedRow, defaultOption]);

  const commitValue = (
    event: React.SyntheticEvent | React.FocusEvent<HTMLInputElement>,
    val: string | number | null
  ) => {
    let finalVal = defaultOption;

    if (val !== null && val.toString().trim() !== "") {
      const parsed = Number(val);
      if (!Number.isNaN(parsed)) {
        if (parsed < 1) {
          finalVal = 1;
        } else {
          finalVal = parsed;
        }
      }
    }

    onRowsChange(event, finalVal);
    setInputValue(finalVal.toString());
  };

  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    newValue: string | number | null,
    reason: string
  ) => {
    if (reason === "clear") {
      commitValue(event, defaultOption);
    } else {
      commitValue(event, newValue);
    }
  };


  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    commitValue(event, inputValue);
  };

  return (
    <Autocomplete<RowsPerPageOption | string, false, true, true>
      size="small"
      freeSolo
      options={rowOptions}
      value={selectedRow ?? defaultOption}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      onChange={handleAutocompleteChange}
      getOptionLabel={(option) => option.toString()}
      clearIcon={null}
      disableClearable={true}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select rows"
          onBlur={handleBlur}
          type="number"
          sx={{
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
              display: "none",
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              min: 1,
            },
          }}
        />
      )}
      sx={{ minWidth: 160 }}
    />
  );
}
