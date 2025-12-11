"use client";

import Link from "next/link";
import { AppBar, Toolbar, Box, Typography, Button, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/store/slice/authSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Header() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const router = useRouter();
    useEffect(() => {
        if (!isAuthenticated && pathname !== "/login" && pathname !== "/signup" && pathname !== "/" && pathname !== "/forget-password") {
            router.push("/login");
        }
    }, [isAuthenticated]);
    const publicLinks = [
        { label: "Sign In", href: "/login" },
        { label: "Sign Up", href: "/signup" },
    ];

    const privateLinks = [
        { label: "Dashboard", href: "/dashboard" },
    ];

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "#fafafa",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: 56,
                    px: { xs: 2, sm: 3, md: 4 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >

                <Typography
                    variant="h6"
                    component={Link}
                    href="/"
                    sx={{
                        textDecoration: "none",
                        color: "text.primary",
                        fontWeight: 600,
                        letterSpacing: 0.3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                color: "white",
                                mr: 1,
                                width: 32,
                                height: 32,
                                fontSize: "0.8rem",
                            }}
                        >
                            API
                        </Avatar>
                        API Analytics
                    </Box>
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, sm: 1.5 },
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
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
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
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
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
                                fontSize: "0.85rem",
                                fontWeight: 500,
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
