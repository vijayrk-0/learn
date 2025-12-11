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
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Card
                    sx={{
                        minWidth: 275,
                        boxShadow: 3,
                        borderRadius: 2,
                        padding: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                mb: 3,
                            }}
                        >
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{ fontWeight: "bold", color: "primary.main" }}
                            >
                                {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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
