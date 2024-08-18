"use client";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { GlobalStateProvider } from "@/contexts/global-state-context";
import GlobalLoadingIndicator from "@/components/Loading";
import TopBar from "@/components/TopBar";
import { SocketProvider } from "@/contexts/web-socket-context";
import { NavbarProvider, useNavbar } from "@/contexts/navbar-context";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  weight: ["400", "900", "700", "500", "200", "300"],
  subsets: ["latin"],
});

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { isPinned } = useNavbar();
  return (
    <div
      className={`fixed z-[10] ${
        isPinned ? "left-[15vw]" : "left-0"
      } bottom-0 top-[60px] right-0 bg-black p-10 overflow-y-auto`}
    >
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthPage = usePathname().startsWith('/auth');

  if (isAuthPage) {
    return children;
  }

  return (
    <html lang="en">
      <body className={`${poppins.className} flex bg-black text-base`}>
        <GlobalStateProvider>
          <GlobalLoadingIndicator />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <NavbarProvider>
              <TopBar />
              <SideBar />
              <SocketProvider>
                <ContentWrapper>{children}</ContentWrapper>
              </SocketProvider>
            </NavbarProvider>
          </ThemeProvider>
        </GlobalStateProvider>
        <Toaster />
      </body>
    </html>
  );
}