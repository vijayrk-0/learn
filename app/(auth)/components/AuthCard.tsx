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
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: { xs: 4, sm: 6, md: 8 },
                    marginBottom: { xs: 4, sm: 6 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Card
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 480,
                        borderRadius: 3,
                        padding: { xs: 2, sm: 3, md: 4 },
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12)",
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
                                mb: 4,
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "primary.main",
                                    mb: 1,
                                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "text.secondary",
                                    fontSize: { xs: "0.875rem", sm: "1rem" },
                                    maxWidth: "80%",
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
