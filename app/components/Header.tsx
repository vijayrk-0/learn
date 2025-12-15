"use client";

import Link from "next/link";
import { AppBar, Toolbar, Box, Typography, Button, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/store/slice/authSlice";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const router = useRouter();

    useEffect(() => {
        if (
            !isAuthenticated &&
            pathname !== "/login" &&
            pathname !== "/signup" &&
            pathname !== "/forget-password"
        ) {
            router.push("/login");
        }
    }, [isAuthenticated, pathname, router]);

    const publicLinks = [
        { label: "Sign In", href: "/login" },
        { label: "Sign Up", href: "/signup" },
    ];

    const privateLinks = [{ label: "Dashboard", href: "/dashboard" }];

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{
                height: 60,
                minHeight: 60,
                maxHeight: 60,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "#fafafa",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: 60,
                    px: { xs: 1.5, sm: 3, md: 4 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: { xs: 1, sm: 2 },
                }}
            >
                {/* Title */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="h6"
                        component={Link}
                        href="/"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "text.primary",
                            fontWeight: 600,
                            letterSpacing: 0.3,
                            fontSize: { xs: "0.95rem", sm: "1.05rem" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                color: "white",
                                mr: 1,
                                width: { xs: 28, sm: 32 },
                                height: { xs: 28, sm: 32 },
                                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                flexShrink: 0,
                            }}
                        >
                            API
                        </Avatar>

                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                            API Analytics
                        </Box>
                        <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                            API
                        </Box>
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: { xs: 0.5, sm: 1.5 },
                        flexWrap: "wrap",
                    }}
                >
                    {!isAuthenticated &&
                        publicLinks.map((item) => (
                            <Button
                                key={item.href}
                                component={Link}
                                href={item.href}
                                color="inherit"
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                    fontWeight: 500,
                                    px: { xs: 1, sm: 1.5 },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}

                    {isAuthenticated &&
                        privateLinks.map((item) => (
                            <Button
                                key={item.href}
                                component={Link}
                                href={item.href}
                                color="inherit"
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                    fontWeight: 500,
                                    px: { xs: 1, sm: 1.5 },
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}

                    {isAuthenticated && (
                        <Button
                            onClick={handleLogout}
                            color="inherit"
                            size="small"
                            sx={{
                                textTransform: "none",
                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                fontWeight: 500,
                                px: { xs: 1, sm: 1.5 },
                            }}
                        >
                            Logout
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
