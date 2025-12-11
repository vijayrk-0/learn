"use client";

import React from "react";
import { Grid, Typography, Link } from "@mui/material";

interface AuthFooterProps {
    text: string;
    linkText: string;
    linkHref: string;
}

export default function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
    return (
        <Grid container justifyContent="center">
            <Grid>
                <Typography variant="body2" color="text.secondary">
                    {text}{" "}
                    <Link
                        href={linkHref}
                        variant="body2"
                        underline="hover"
                        sx={{ fontWeight: "bold" }}
                    >
                        {linkText}
                    </Link>
                </Typography>
            </Grid>
        </Grid>
    );
}
