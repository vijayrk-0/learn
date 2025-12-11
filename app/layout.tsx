import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./components/ReduxProvider";
import ThemeRegistry from "./components/ThemeRegistry";
import { AuthInitializer } from "./components/AuthInitializer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Box, Container } from "@mui/material";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "API Monitoring Tool",
  description: "API Monitoring Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        // make body a full-height flex column
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ThemeRegistry>
          <ReduxProvider>
            <ErrorBoundary>
              <AuthInitializer>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,      // allow children to shrink
                  }}
                >
                  {/* Header */}
                  <Box
                    component="header"
                    sx={{
                      flexShrink: 0,
                      zIndex: 10,
                    }}
                  >
                    <Header />
                  </Box>

                  {/* Main */}
                  <Box
                    component="main"
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      overflowY: "auto",
                      overflowX: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Container
                      maxWidth="lg"
                      sx={{
                        flex: 1,
                        width: "100%",
                        minHeight: "calc(100vh - 200px)",
                        py: { xs: 2, sm: 3, md: 4 },
                      }}
                    >
                      {children}
                    </Container>
                  </Box>

                  {/* Footer */}
                  <Box
                    component="footer"
                    sx={{
                      flexShrink: 0,
                      zIndex: 10,
                    }}
                  >
                    <Footer />
                  </Box>
                </Box>
              </AuthInitializer>
            </ErrorBoundary>
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
