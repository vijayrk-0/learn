"use client";

import { useRouter } from "next/navigation";
import { IconButton, Tooltip } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <Tooltip title="Go Back">
            <IconButton
                onClick={handleBack}
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                        bgcolor: "primary.dark",
                    },
                }}
            >
                <ArrowBackIcon />
            </IconButton>
        </Tooltip>
    );
}
