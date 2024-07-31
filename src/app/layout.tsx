"use client"

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import SideBar from "@/components/Sidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { GlobalStateProvider } from "@/contexts/global-state-context";
import GlobalLoadingIndicator from "@/components/Loading";
import TopBar from "@/components/TopBar";

const poppins = Poppins({weight: ['400', '900', '700', '500', '200', '300'], subsets: ['latin']});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex bg-black text-base`}>
      <GlobalStateProvider>
        <GlobalLoadingIndicator></GlobalLoadingIndicator>
      <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            // enableSystem
            disableTransitionOnChange
          >
            <TopBar></TopBar>
            <SideBar></SideBar>
            <div className="fixed z-[10] left-[15vw] bottom-0 top-[60px] right-5 bg-black p-10 overflow-y-auto border-t-1 border-l-1 border-white/[0.2]">
            {children}
            </div>
          </ThemeProvider>
      </GlobalStateProvider>
          <Toaster />
          </body>
    </html>
  );
}
