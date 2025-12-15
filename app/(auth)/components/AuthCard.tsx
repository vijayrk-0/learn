"use client";

import React from "react";
import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
} from "@mui/material";

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <Container
            component="main"
            maxWidth="xs"
            disableGutters
            sx={{
                width: "100%",
                minHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 1.5, sm: 0 },
                py: { xs: 1.5, sm: 3, md: 4 },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        borderRadius: 2,
                        p: { xs: 1.75, sm: 3, md: 4 },
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                            boxShadow: "0 10px 32px rgba(0, 0, 0, 0.12)",
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                mb: { xs: 2.5, sm: 4 },
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "primary.main",
                                    mb: 0.75,
                                    fontSize: {
                                        xs: "1.25rem",   
                                        sm: "1.6rem",
                                        md: "2rem",
                                    },
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "text.secondary",
                                    fontSize: { xs: "0.8rem", sm: "0.95rem" },
                                    maxWidth: { xs: "100%", sm: "80%" },
                                }}
                            >
                                {subtitle}
                            </Typography>
                        </Box>
                        {children}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
