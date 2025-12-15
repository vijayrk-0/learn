"use client";

import { Grid, Typography, Link } from "@mui/material";

interface AuthFooterProps {
    text: string;
    linkText: string;
    linkHref: string;
}

export default function AuthFooter({ text, linkText, linkHref }: AuthFooterProps) {
    return (
        <Grid
            container
            justifyContent="center"
            sx={{
                mt: { xs: 1.5, sm: 2 },
            }}
        >
            <Grid container justifyContent="center">
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        textAlign: "center",
                        fontSize: { xs: "0.8rem", sm: "0.875rem" }, 
                    }}
                >
                    {text}
                    <Link
                        href={linkHref}
                        variant="body2"
                        underline="hover"
                        sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                    >
                        {linkText}
                    </Link>
                </Typography>
            </Grid>
        </Grid>
    );
}
