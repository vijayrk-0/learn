import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./components/ReduxProvider";
import ThemeRegistry from "./components/ThemeRegistry";
import { AuthInitializer } from "./components/AuthInitializer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Box } from "@mui/material";

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

const HEADER_HEIGHT = 60;

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
                    minHeight: "100vh",
                    width: "100%",
                  }}
                >
                  {/* Header */}
                  <Box
                    component="header"
                    sx={{
                      flexShrink: 0,
                      zIndex: 10,
                      height: HEADER_HEIGHT,
                      width: "100%",
                    }}
                  >
                    <Header />
                  </Box>

                  {/* Main content */}
                  <Box
                    component="main"
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      overflowY: "hidden",
                      overflowX: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    {children}
                  </Box>

                  {/* Footer */}
                  <Box
                    component="footer"
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
